const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/authMiddleware');

// Protect all skill routes
router.use(protect);

// @route   GET /api/skills
// @desc    Get all skills for logged in user (optional filter: ?status=learnt or to-learn)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const queryObject = { user: req.user._id };

    if (status) {
      queryObject.status = status;
    }

    const skills = await Skill.find(queryObject).sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/skills
// @desc    Add a new skill (either 'learnt' or 'to-learn')
router.post('/', async (req, res) => {
  try {
    const { name, category, status, proficiency, startDate, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const skill = await Skill.create({
      user: req.user._id,
      name,
      category: category || 'General',
      status: status || 'to-learn',
      proficiency: proficiency || 'Intermediate',
      startDate: startDate || (status === 'to-learn' ? Date.now() : null),
      notes: notes || '',
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/skills/:id/toggle
// @desc    Toggle skill between 'to-learn' and 'learnt'
router.patch('/:id/toggle', async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Toggle status
    skill.status = skill.status === 'learnt' ? 'to-learn' : 'learnt';
    await skill.save();

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
