const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

// GET all notifications
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find().sort("-createdAt");
  res.json(notifications);
});

// MARK AS READ
router.put("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  res.json(notification);
});

module.exports = router;