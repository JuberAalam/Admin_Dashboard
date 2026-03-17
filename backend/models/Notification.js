const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    read: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);