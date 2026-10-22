const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    // 'learnt' for skills you already know, 'to-learn' for your learning roadmap
    status: {
      type: String,
      enum: ['learnt', 'to-learn'],
      default: 'to-learn',
    },
    // For 'learnt' skills
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    // For 'to-learn' skills: this startDate will display on the Calendar!
    startDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);