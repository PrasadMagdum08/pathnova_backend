// pathnova_node_backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedToBatch: String, // optional
  assignedToStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
