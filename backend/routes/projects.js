const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// GET projects
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query = { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };
    }
    const projects = await Project.find(query)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create project — admin & manager
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update project — admin & manager
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE project — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
