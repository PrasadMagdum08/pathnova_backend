const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  task_type: String,
  assignedToBatch: String,
  assignedToStudent: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },

  // future-proof fields
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  attachments: [String], // array of file URLs or IDs
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);