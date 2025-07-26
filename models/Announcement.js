const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },

  // Clear semantic fields
  importance: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  priority: {
    type: String,
    enum: ['Normal', 'Urgent', 'Immediate'],
    default: 'Normal'
  },

  // Targeting: Audience can be 'all', a batch, a single student, or a group of students
  targetType: {
    type: String,
    enum: ['All', 'Batch', 'Student', 'Group'],
    required: true
  },

  // Depending on targetType, one of these fields will be used:
  toBatch: { type: String }, // e.g. "BatchA"
  toStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // for single student
  toStudentGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // for group

  // Optional fields
  targetAudience: [{ type: String, default: ['All'] }], // for legacy or tag-based targeting
  attachments: [String], // file/image URLs
  isPinned: { type: Boolean, default: false },
  expiresAt: { type: Date },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
