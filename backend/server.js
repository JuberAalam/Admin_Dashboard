const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://admin-dashboard-aaq4.vercel.app'
    ],
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'Server running', time: new Date() })
);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));



// Create only ONE admin automatically
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  try {

    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {

      const hashedPassword = await bcrypt.hash('admin123', 10);

      await User.create({
        name: 'Super Admin',
        email: 'admin@college.edu',
        password: hashedPassword,
        role: 'admin'
      });

      console.log('✅ Default Admin Created');
      console.log('Email: admin@college.edu');
      console.log('Password: admin123');

    } else {

      console.log('ℹ️ Admin already exists');

    }

  } catch (error) {

    console.error('❌ Error creating admin:', error);

  }
}