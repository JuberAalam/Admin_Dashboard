const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification'); // ✅ NEW
const { protect, authorize } = require('../middleware/auth');


// ✅ GET announcements
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetRoles: req.user.role },
        { targetRoles: [] }
      ],
    })
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.json(announcements);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ CREATE announcement + 💾 save + 🔔 emit
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const ann = await Announcement.create({
      ...req.body,
      createdBy: req.user._id
    });

    // 💾 Save notification
    const notification = await Notification.create({
      type: "ANNOUNCEMENT_CREATED",
      message: `📢 New announcement: ${ann.title}`,
      refId: ann._id
    });

    // 🔔 Emit
    const io = req.app.get("io");

    if (io) {
      io.emit("notification", notification);
    }

    res.status(201).json(ann);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ UPDATE announcement + 💾 save + 🔔 emit
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ann) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const notification = await Notification.create({
      type: "ANNOUNCEMENT_UPDATED",
      message: `✏️ Announcement updated: ${ann.title}`,
      refId: ann._id
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("notification", notification);
    }

    res.json(ann);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE announcement + 💾 save + 🔔 emit
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndDelete(req.params.id);

    if (!ann) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const notification = await Notification.create({
      type: "ANNOUNCEMENT_DELETED",
      message: `❌ Announcement deleted: ${ann.title}`,
      refId: ann._id
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("notification", notification);
    }

    res.json({ message: 'Deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;