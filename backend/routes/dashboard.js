const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    const role = req.user.role;
    let stats = {};

    if (role === 'admin') {
      const [totalUsers, totalProjects, activeProjects, completedProjects, announcements] = await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Project.countDocuments({ status: 'active' }),
        Project.countDocuments({ status: 'completed' }),
        Announcement.countDocuments({ isActive: true }),
      ]);
      const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);
      const projectsByStatus = await Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      stats = { totalUsers, totalProjects, activeProjects, completedProjects, announcements, usersByRole, projectsByStatus };
    } else if (role === 'manager') {
      const myProjects = await Project.find({ createdBy: req.user._id });
      const totalTeamMembers = await User.countDocuments({ role: 'client' });
      stats = {
        myProjects: myProjects.length,
        activeProjects: myProjects.filter(p => p.status === 'active').length,
        completedProjects: myProjects.filter(p => p.status === 'completed').length,
        totalTeamMembers,
      };
    } else {
      const myProjects = await Project.find({ assignedTo: req.user._id });
      stats = {
        assignedProjects: myProjects.length,
        activeProjects: myProjects.filter(p => p.status === 'active').length,
        completedProjects: myProjects.filter(p => p.status === 'completed').length,
        pendingProjects: myProjects.filter(p => p.status === 'planning').length,
      };
    }

    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
