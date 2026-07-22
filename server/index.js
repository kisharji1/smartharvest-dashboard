// Express server setup for user authentication and iteration tracking
const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Lowdb setup
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { users: [], iterations: [] });

// Initialize database with default structure if empty
async function initDB() {
  await db.read();
  db.data ||= { users: [], iterations: [] };
  await db.write();
}
initDB();

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  console.log('Current users:', db.data.users);
  if (db.data.users.find(u => u.username === username)) {
    console.log('Signup attempt with existing username:', username);
    return res.status(400).json({ error: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = db.data.users.length ? db.data.users[db.data.users.length - 1].id + 1 : 1;
  db.data.users.push({ id, username, password: hashedPassword, created_at: new Date().toISOString() });
  await db.write();
  console.log('User registered:', username);
  console.log('Updated users:', db.data.users);
  res.json({ message: 'User registered' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  console.log('Login attempt for username:', username);
  console.log('Current users:', db.data.users);
  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    console.warn('Login failed: user not found:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.warn('Login failed: password mismatch for user:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
  console.log('User logged in:', username);
  res.json({ token });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Store iteration endpoint
app.post('/api/iteration', authenticateToken, async (req, res) => {
  const { data } = req.body;
  await db.read();
  console.log('Current iterations:', db.data.iterations);
  const id = db.data.iterations.length ? db.data.iterations[db.data.iterations.length - 1].id + 1 : 1;
  db.data.iterations.push({ id, user_id: req.user.id, data, created_at: new Date().toISOString() });
  await db.write();
  console.log('Iteration saved for user:', req.user.id);
  console.log('Updated iterations:', db.data.iterations);
  res.json({ message: 'Iteration saved' });
});

// Get user iterations
app.get('/api/iterations', authenticateToken, async (req, res) => {
  await db.read();
  const userIterations = db.data.iterations.filter(it => it.user_id === req.user.id);
  res.json(userIterations);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
