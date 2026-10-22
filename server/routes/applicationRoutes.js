const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

// All routes here require JWT authentication
router.use(protect);

// @route   GET /api/applications/stats
// @desc    Get counts and aggregation by status
router.get('/stats', async (req, res) => {
  try {
    const stats = await Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const defaultStats = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Total: 0,
    };

    let total = 0;
    stats.forEach((item) => {
      defaultStats[item._id] = item.count;
      total += item.count;
    });
    defaultStats.Total = total;

    res.json(defaultStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications
// @desc    Get all applications for logged-in user
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const queryObject = { user: req.user._id };

    if (status && status !== 'All') {
      queryObject.status = status;
    }

    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(queryObject).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/applications
// @desc    Create a new application
router.post('/', async (req, res) => {
  try {
    const {
      company,
      role,
      jobLink,
      salaryExpectation,
      status,
      applicationDate,
      interviewDate,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and Role are required' });
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      jobLink: jobLink || '',
      salaryExpectation: salaryExpectation || '',
      status: status || 'Applied',
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      notes: notes || '',
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update only status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update full application details
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;