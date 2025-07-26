const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');

// // Register Admin
exports.createOrUpdateAdminProfile = async (req, res) => {
  const { name, email, whatsapp_contact } = req.body;
  const userId = req.user?.id;

  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { userId }, // search by userId
      {
        $set: {
          userId, 
          name,
          email,
          whatsapp_contact
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(201).json({
      message: 'Admin profile created/updated successfully',
      admin: updatedAdmin
    });
  } catch (err) {
    console.error("Error in createOrUpdateAdminProfile:", err);
    res.status(500).json({ message: 'Failed to create/update admin' });
  }
};


exports.getProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

  try {
    // const profile = await Admin.findOne({ userId: userId });
    const admins = await Admin.find({});

    if (!admins) {
      console.log("Decoded userId from JWT:", req.user.id);
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.status(200).json({
      message: 'Admin profile fetched successfully',
      admin: admins,
    });
  } catch (err) {
    console.error("Error fetching admin profile:", err.message);
    res.status(500).json({ message: 'Server error while fetching profile' });
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
  const { title, description, assignedToBatch } = req.body;

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

  try {
    const task = await Task.create({
      title,
      description,
      assignedToBatch,
      assignedToStudent: req.Student?.id,
      assignedBy: req.Admin?.id
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
