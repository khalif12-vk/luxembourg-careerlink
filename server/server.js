const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');
require('dotenv').config();

const { Resend } = require('resend');

const app = express();

const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'luxembourg-careerlink-development-secret';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not configured.');
  process.exit(1);
}

/* =========================================================
   DATABASE
========================================================= */

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: false },
});

/* =========================================================
   RESEND
========================================================= */

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());

/* =========================================================
   DATABASE SETUP
========================================================= */

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        email_verified BOOLEAN DEFAULT TRUE,
        role TEXT NOT NULL DEFAULT 'applicant',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_title TEXT NOT NULL,
        category TEXT NOT NULL,
        salary TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Submitted',
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );
    `);

    console.log('PostgreSQL database tables are ready.');

    await ensureAdminAccount();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/* =========================================================
   ADMIN ACCOUNT
========================================================= */
async function ensureAdminAccount() {
  const adminEmail = (
    process.env.ADMIN_EMAIL ||
    'recruitment@luxembourgcareerlink.com'
  )
    .trim()
    .toLowerCase();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.log(
      'ADMIN_PASSWORD is not configured. Admin account was not automatically created/reset.'
    );
    return;
  }

  if (adminPassword.length < 8) {
    console.error(
      'ADMIN_PASSWORD must contain at least 8 characters.'
    );
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const existing = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [adminEmail]
    );

    if (existing.rows.length === 0) {
      const adminId = `LC-ADMIN-${Date.now()}`;

      await pool.query(
        `
        INSERT INTO users (
          id,
          name,
          email,
          phone,
          country,
          password_hash,
          email_verified,
          role
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          adminId,
          'Luxembourg CareerLink Recruitment',
          adminEmail,
          '',
          '',
          passwordHash,
          true,
          'admin',
        ]
      );

      console.log('Recruitment admin account created.');
    } else {
      await pool.query(
        `
        UPDATE users
        SET
          role = 'admin',
          password_hash = $2,
          email_verified = true
        WHERE email = $1
        `,
        [adminEmail, passwordHash]
      );

      console.log('Recruitment admin password synchronized.');
    }
  } catch (error) {
    console.error('Admin account setup error:', error);
  }
}
/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      success: true,
      message: 'Luxembourg CareerLink backend is running',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check database error:', error);

    res.status(500).json({
      success: false,
      message: 'Backend is running but database connection failed.',
      database: 'disconnected',
    });
  }
});

/* =========================================================
   REGISTER
========================================================= */

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      password,
    } = req.body;

    if (!name || !email || !phone || !country || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be completed.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userId = `LC-${Date.now()}-${crypto
      .randomBytes(3)
      .toString('hex')}`;

    const role =
      normalizedEmail ===
      'recruitment@luxembourgcareerlink.com'
        ? 'admin'
        : 'applicant';

    const result = await pool.query(
      `
      INSERT INTO users (
        id,
        name,
        email,
        phone,
        country,
        password_hash,
        email_verified,
        role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        name,
        email,
        phone,
        country,
        email_verified,
        role,
        created_at
      `,
      [
        userId,
        name.trim(),
        normalizedEmail,
        phone.trim(),
        country.trim(),
        passwordHash,
        true,
        role,
      ]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Account created successfully. You can now log in.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        emailVerified: newUser.email_verified,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message:
        'Something went wrong while creating the account.',
    });
  }
});

/* =========================================================
   LOGIN
========================================================= */

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        country,
        password_hash,
        email_verified,
        role,
        created_at
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || 'applicant',
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
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
        emailVerified: user.email_verified,
        role: user.role || 'applicant',
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Something went wrong while logging in.',
    });
  }
});

/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
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
      message: 'Invalid or expired session.',
    });
  }
}

/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Recruitment access is restricted.',
    });
  }

  next();
}

/* =========================================================
   TEMPORARY ADMIN SETUP
========================================================= */

app.post('/api/setup-admin', async (req, res) => {
  try {
    const { email, setupKey } = req.body;

    if (
      !process.env.ADMIN_SETUP_KEY ||
      setupKey !== process.env.ADMIN_SETUP_KEY
    ) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup key.',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
      UPDATE users
      SET role = 'admin'
      WHERE email = $1
      RETURNING id, email, role
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      message: 'User promoted to admin successfully.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Admin setup error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to promote user.',
    });
  }
});

/* =========================================================
   CURRENT USER
========================================================= */

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        country,
        email_verified,
        role,
        created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Auth/me error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load user account.',
    });
  }
});

/* =========================================================
   SUBMIT APPLICATION
========================================================= */

app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    const {
      jobTitle,
      category,
      salary,
      location,
    } = req.body;

    if (!jobTitle || !category || !salary || !location) {
      return res.status(400).json({
        success: false,
        message: 'Job information is incomplete.',
      });
    }

    const alreadyApplied = await pool.query(
      `
      SELECT id
      FROM applications
      WHERE user_id = $1
      AND job_title = $2
      LIMIT 1
      `,
      [req.user.userId, jobTitle]
    );

    if (alreadyApplied.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          'You have already applied for this position.',
      });
    }

    const applicationId = `APP-${Date.now()}-${crypto
      .randomBytes(3)
      .toString('hex')}`;

    const result = await pool.query(
      `
      INSERT INTO applications (
        id,
        user_id,
        job_title,
        category,
        salary,
        location,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        user_id,
        job_title,
        category,
        salary,
        location,
        status,
        submitted_at,
        updated_at
      `,
      [
        applicationId,
        req.user.userId,
        jobTitle,
        category,
        salary,
        location,
        'Submitted',
      ]
    );

    const application = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: {
        id: application.id,
        userId: application.user_id,
        jobTitle: application.job_title,
        category: application.category,
        salary: application.salary,
        location: application.location,
        status: application.status,
        submittedAt: application.submitted_at,
        updatedAt: application.updated_at,
      },
    });
  } catch (error) {
    console.error('Application submission error:', error);

    res.status(500).json({
      success: false,
      message:
        'Something went wrong while submitting your application.',
    });
  }
});

/* =========================================================
   GET MY APPLICATIONS
========================================================= */

app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        job_title,
        category,
        salary,
        location,
        status,
        submitted_at,
        updated_at
      FROM applications
      WHERE user_id = $1
      ORDER BY submitted_at DESC
      `,
      [req.user.userId]
    );

    const applications = result.rows.map((application) => ({
      id: application.id,
      userId: application.user_id,
      jobTitle: application.job_title,
      category: application.category,
      salary: application.salary,
      location: application.location,
      status: application.status,
      submittedAt: application.submitted_at,
      updatedAt: application.updated_at,
    }));

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('My applications error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load applications.',
    });
  }
});

/* =========================================================
   GET ALL APPLICATIONS - ADMIN
========================================================= */

app.get(
  '/api/admin/applications',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          a.id,
          a.user_id,
          a.job_title,
          a.category,
          a.salary,
          a.location,
          a.status,
          a.submitted_at,
          a.updated_at,

          u.id AS applicant_id,
          u.name AS applicant_name,
          u.email AS applicant_email,
          u.phone AS applicant_phone,
          u.country AS applicant_country

        FROM applications a

        LEFT JOIN users u
          ON u.id = a.user_id

        ORDER BY a.submitted_at DESC
      `);

      const applications = result.rows.map((application) => ({
        id: application.id,
        userId: application.user_id,
        jobTitle: application.job_title,
        category: application.category,
        salary: application.salary,
        location: application.location,
        status: application.status,
        submittedAt: application.submitted_at,
        updatedAt: application.updated_at,

        applicant: application.applicant_id
          ? {
              id: application.applicant_id,
              name: application.applicant_name,
              email: application.applicant_email,
              phone: application.applicant_phone,
              country: application.applicant_country,
            }
          : null,
      }));

      res.json({
        success: true,
        applications,
      });
    } catch (error) {
      console.error('Admin applications error:', error);

      res.status(500).json({
        success: false,
        message: 'Unable to load admin applications.',
      });
    }
  }
);

/* =========================================================
   UPDATE APPLICATION STATUS - ADMIN
========================================================= */

app.patch(
  '/api/admin/applications/:id/status',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        'Submitted',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Approved',
        'Rejected',
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application status.',
        });
      }

      const result = await pool.query(
        `
        UPDATE applications
        SET
          status = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING
          id,
          user_id,
          job_title,
          category,
          salary,
          location,
          status,
          submitted_at,
          updated_at
        `,
        [status, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Application not found.',
        });
      }

      const application = result.rows[0];

      res.json({
        success: true,
        message:
          'Application status updated successfully.',
        application: {
          id: application.id,
          userId: application.user_id,
          jobTitle: application.job_title,
          category: application.category,
          salary: application.salary,
          location: application.location,
          status: application.status,
          submittedAt: application.submitted_at,
          updatedAt: application.updated_at,
        },
      });
    } catch (error) {
      console.error('Application status error:', error);

      res.status(500).json({
        success: false,
        message: 'Unable to update application status.',
      });
    }
  }
);

/* =========================================================
   TEST EMAIL
========================================================= */

app.get('/api/test-email', async (req, res) => {
  try {
    if (!resend) {
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY is not configured.',
      });
    }

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

/* =========================================================
   START SERVER
========================================================= */

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `Luxembourg CareerLink backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Server could not start because the database is unavailable.'
    );

    process.exit(1);
  }
}

startServer();