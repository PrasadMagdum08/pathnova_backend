// pathnova_backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  whatsapp_contact: { type: Number, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
