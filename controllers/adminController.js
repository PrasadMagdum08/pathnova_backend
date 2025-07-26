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
const Task = require('../models/Task'); // Ensure model is properly imported
const { validationResult } = require('express-validator'); // Optional if using validators

exports.assignTask = async (req, res) => {
  try {
    // Optional: If using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      assignedToBatch,
      assignedToStudent,
      assignedBy,
      dueDate,            // optional future fields
      priority,
      status,
      attachments
    } = req.body;

    // Construct dynamic task object
    const taskData = {
      title,
      description,
      assignedBy
    };

    // Optional assignment fields
    if (assignedToBatch) taskData.assignedToBatch = assignedToBatch;
    if (assignedToStudent) taskData.assignedToStudent = assignedToStudent;

    // Optional future fields
    if (dueDate) taskData.dueDate = dueDate;
    if (priority) taskData.priority = priority;
    if (status) taskData.status = status;
    if (attachments) taskData.attachments = attachments;

    const task = await Task.create(taskData);
    return res.status(201).json({
      message: 'Task assigned successfully',
      task
    });

  } catch (err) {
    console.error('Error assigning task:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      importance,
      priority,
      targetType,       // 'All', 'Batch', 'Student', 'Group'
      toBatch,
      toStudent,
      toStudentGroup,
      attachments,
      isPinned,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!title || !message || !targetType) {
      return res.status(400).json({ error: 'title, message, and targetType are required' });
    }

    // Prepare base data
    const announcementData = {
      title,
      message,
      importance: importance || 'Medium',
      priority: priority || 'Normal',
      targetType,
      createdBy: req.admin.id
    };

    // Handle targeting logic
    if (targetType === 'Batch' && toBatch) {
      announcementData.toBatch = toBatch;
    } else if (targetType === 'Student' && toStudent) {
      announcementData.toStudent = toStudent;
    } else if (targetType === 'Group' && Array.isArray(toStudentGroup) && toStudentGroup.length > 0) {
      announcementData.toStudentGroup = toStudentGroup;
    } else if (targetType !== 'All') {
      return res.status(400).json({ error: `Missing target info for type: ${targetType}` });
    }

    // Optional fields
    if (attachments) announcementData.attachments = attachments;
    if (typeof isPinned !== 'undefined') announcementData.isPinned = isPinned;
    if (expiresAt) announcementData.expiresAt = new Date(expiresAt);

    const ann = await Announcement.create(announcementData);

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: ann
    });

  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      targetType,
      batchId,
      studentId,
      importance,
      priority,
      pinnedOnly
    } = req.query;

    const query = {};

    // Filter based on target audience
    if (targetType === 'All') {
      query.targetType = 'All';
    } else if (targetType === 'Batch' && batchId) {
      query.targetType = 'Batch';
      query.toBatch = batchId;
    } else if (targetType === 'Student' && studentId) {
      query.targetType = 'Student';
      query.toStudent = studentId;
    } else if (targetType === 'Group' && studentId) {
      query.targetType = 'Group';
      query.toStudentGroup = { $in: [studentId] };
    }

    // Optional filters
    if (importance) query.importance = importance;
    if (priority) query.priority = priority;
    if (pinnedOnly === 'true') query.isPinned = true;

    // Optional: skip expired
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ];

    const announcements = await Announcement
      .find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(announcements);

  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
