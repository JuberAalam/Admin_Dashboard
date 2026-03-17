const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://admin-dashboard-aaq4.vercel.app'
    ],
    credentials: true
  }
});

// ✅ Store io globally
app.set("io", io);

// ✅ Middleware
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

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications')); // ✅ NEW

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server running',
    time: new Date()
  });
});

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // (Optional) join role-based room
  socket.on("joinRole", (role) => {
    socket.join(role);
    console.log(`User joined room: ${role}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    // ✅ IMPORTANT: use server.listen
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });


// ✅ Seed default admin
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