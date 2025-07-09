const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  college: String,
  semester: String,
  current_major: String,
  batch: String,
  intended_specialized_major: String,
  skills: [String],
  upskilling: [String],
  portfolio_url: [String],
  portfolio_building_duration: Number,
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
