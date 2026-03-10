const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ targetRoles: req.user.role }, { targetRoles: [] }],
    }).populate('createdBy', 'name').sort('-createdAt');
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
