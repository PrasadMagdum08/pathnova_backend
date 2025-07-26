const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');

// // Register Admin
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const admin = await Admin.create({ name, email, password: hashed });
//     res.status(201).json({ message: 'Admin registered', admin });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Login Admin
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(404).json({ message: 'Admin not found' });

//     const valid = await bcrypt.compare(password, admin.password);
//     if (!valid) return res.status(403).json({ message: 'Invalid password' });

//     const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET);
//     res.json({ token, admin });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get students (optionally by batch)
exports.getStudents = async (req, res) => {
  const batch = req.query.batch;
  const query = batch ? { batch } : {};
  const students = await Student.find(query);
  res.json(students);
};

// Assign task
exports.assignTask = async (req, res) => {
  const { title, description, assignedToBatch, assignedToStudent } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      assignedToBatch,
      assignedToStudent,
      assignedBy: req.admin.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Announcements
exports.createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
    const ann = await Announcement.create({
      title,
      message,
      createdBy: req.admin.id,
    });
    res.status(201).json(ann);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
};
