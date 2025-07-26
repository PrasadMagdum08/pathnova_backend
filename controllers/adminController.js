const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');

// // Register Admin
exports.createOrUpdateProfile = async (req, res) => {
  const { name, email, password, whatsapp_contact } = req.body;

  const userId = req.user.id;

  try {
    // const existingProfile = await Admin.findOne({ userId });
    // if(existingProfile) return res.status(200).json({message: 'User already exists'});

    const updatedProfile = await Admin.findOneAndUpdate(
      { userId},
      { name, email, whatsapp_contact },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({message: `Admin register or udpated: ${updatedProfile}`});
    // res.status(201).json({ message: 'Admin registered', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const admin = await Admin.findOne({ userId });
    if(!admin) return res.status(404).json({message: 'Profile not found'});
    res.status(200).json(admin);
  } catch (err) {
    console.error(`Profile fetch error: ${err.message}`);
    res.status(500).json({ message: 'Error fetching profile' });
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
