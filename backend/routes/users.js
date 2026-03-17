const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Notification = require('../models/Notification'); // ✅ ADD THIS
const { protect, authorize } = require('../middleware/auth');


// ✅ GET all users — admin & manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { role, search } = req.query;

    let query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt');

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET user by id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ CREATE user + 💾 SAVE + 🔔 EMIT
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password || 'password123', 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      department,
      phone
    });

    // 💾 Save notification
    const notification = await Notification.create({
      type: "USER_CREATED",
      message: `👤 New user added: ${user.name}`,
      refId: user._id,
      refModel: "User"
    });

    // 🔔 Emit
    const io = req.app.get("io");
    if (io) io.emit("notification", notification);

    res.status(201).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ UPDATE user — admin or self
router.put('/:id', protect, async (req, res) => {
  try {
    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { password, ...rest } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE user + 💾 SAVE + 🔔 EMIT
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 💾 Save notification
    const notification = await Notification.create({
      type: "USER_DELETED",
      message: `❌ User deleted: ${user.name}`,
      refId: user._id,
      refModel: "User"
    });

    // 🔔 Emit
    const io = req.app.get("io");
    if (io) io.emit("notification", notification);

    res.json({ message: 'User deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;