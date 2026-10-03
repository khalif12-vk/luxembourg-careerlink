const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const users = JSON.parse(
  fs.readFileSync(USERS_FILE, 'utf8')
);

const email = 'recruitment@luxembourgcareerlink.com';
const password = 'CareerLink@2026';

const existingUser = users.find(
  user => user.email === email
);

if (existingUser) {
  existingUser.role = 'admin';
  console.log('Existing account updated to admin.');
} else {
  const passwordHash = bcrypt.hashSync(password, 10);

  users.push({
    id: `LC-ADMIN-${Date.now()}`,
    name: 'Recruitment Admin',
    email,
    phone: '',
    country: 'Luxembourg',
    passwordHash,
    emailVerified: true,
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  console.log('Admin account created successfully.');
}

fs.writeFileSync(
  USERS_FILE,
  JSON.stringify(users, null, 2),
  'utf8'
);

console.log(`Email: ${email}`);
console.log(`Password: ${password}`);