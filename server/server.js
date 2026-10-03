const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();
const PORT = 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || 'luxembourg-careerlink-development-secret';

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}

if (!fs.existsSync(APPLICATIONS_FILE)) {
  fs.writeFileSync(APPLICATIONS_FILE, '[]', 'utf8');
}
function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2),
    'utf8'
  );
}
function getApplications() {
  try {
    return JSON.parse(
      fs.readFileSync(APPLICATIONS_FILE, 'utf8')
    );
  } catch (error) {
    return [];
  }
}

function saveApplications(applications) {
  fs.writeFileSync(
    APPLICATIONS_FILE,
    JSON.stringify(applications, null, 2),
    'utf8'
  );
}
/* HEALTH CHECK */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luxembourg CareerLink backend is running'
  });
});

/* REGISTER */
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      password
    } = req.body;

    if (!name || !email || !phone || !country || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be completed.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.'
      });
    }

    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      user => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

const newUser = {
  id: `LC-${Date.now()}`,
  name: name.trim(),
  email: normalizedEmail,
  phone: phone.trim(),
  country: country.trim(),
  passwordHash,
  emailVerified: true,
  role: 'applicant',
  createdAt: new Date().toISOString()
};

    users.push(newUser);
    saveUsers(users);



res.status(201).json({
  success: true,
  message: 'Account created successfully. You can now log in.',
  user: {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    country: newUser.country,
    emailVerified: newUser.emailVerified
  }
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the account.'
    });
  }
});

/* LOGIN */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      account => account.email === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

   const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role || 'applicant'
  },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

   res.json({
  success: true,
  message: 'Login successful.',
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    emailVerified: user.emailVerified,
    role: user.role || 'applicant'
  }
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Something went wrong while logging in.'
    });
  }
});

/* AUTHENTICATION MIDDLEWARE */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session.'
    });
  }
}
/* ADMIN / RECRUITER AUTHORIZATION */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Recruitment access is restricted.'
    });
  }

  next();
}
/* CURRENT USER */
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const users = getUsers();

  const user = users.find(
    account => account.id === req.user.userId
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    }
  });
});
/* SUBMIT APPLICATION */
app.post('/api/applications', authenticateToken, (req, res) => {
  try {
    const {
      jobTitle,
      category,
      salary,
      location
    } = req.body;

    if (!jobTitle || !category || !salary || !location) {
      return res.status(400).json({
        success: false,
        message: 'Job information is incomplete.'
      });
    }

    const applications = getApplications();

    const alreadyApplied = applications.find(
      application =>
        application.userId === req.user.userId &&
        application.jobTitle === jobTitle
    );

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this position.'
      });
    }

    const newApplication = {
      id: `APP-${Date.now()}`,
      userId: req.user.userId,
      jobTitle,
      category,
      salary,
      location,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    };

    applications.push(newApplication);
    saveApplications(applications);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: newApplication
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting your application.'
    });
  }
});

/* GET MY APPLICATIONS */
app.get('/api/applications', authenticateToken, (req, res) => {
  try {
    const applications = getApplications();

    const userApplications = applications.filter(
      application => application.userId === req.user.userId
    );

    res.json({
      success: true,
      applications: userApplications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to load applications.'
    });
  }
});
/* GET ALL APPLICATIONS - ADMIN */
app.get('/api/admin/applications', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = getUsers();
    const applications = getApplications();

    const allApplications = applications.map((application) => {
      const applicant = users.find(
        user => user.id === application.userId
      );

      return {
        ...application,
        applicant: applicant
          ? {
              id: applicant.id,
              name: applicant.name,
              email: applicant.email,
              phone: applicant.phone,
              country: applicant.country
            }
          : null
      };
    });

    res.json({
      success: true,
      applications: allApplications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to load admin applications.'
    });
  }
});
/* UPDATE APPLICATION STATUS - ADMIN */
app.patch('/api/admin/applications/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Approved',
      'Rejected'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status.'
      });
    }

    const applications = getApplications();

    const applicationIndex = applications.findIndex(
      application => application.id === req.params.id
    );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    applications[applicationIndex].status = status;
    applications[applicationIndex].updatedAt = new Date().toISOString();

    saveApplications(applications);

    res.json({
      success: true,
      message: 'Application status updated successfully.',
      application: applications[applicationIndex]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to update application status.'
    });
  }
});
app.get('/api/test-email', async (req, res) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['k4910910@gmail.com'],
      subject: 'Luxembourg CareerLink Email Test',
      html: `
        <h2>Luxembourg CareerLink</h2>
        <p>This is a test email from the CareerLink backend.</p>
        <p>Resend email integration is working successfully.</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent.',
        error,
      });
    }

    res.json({
      success: true,
      message: 'Test email sent successfully.',
      emailId: data.id,
    });

  } catch (error) {
    console.error('Email test error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to send test email.',
    });
  }
});



app.listen(PORT, () => {
  console.log(
    `Luxembourg CareerLink backend running at http://localhost:${PORT}`
  );
});