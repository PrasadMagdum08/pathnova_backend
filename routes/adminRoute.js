// pathnova_node_backend/routes/adminRoute.js
const express = require('express')
const router = express.Router();
const {
    register,
    login,
    getProfile,
    getStudents,
    assignTask,
    createAnnouncement,
    getAnnouncements
} = require('../controllers/adminController')
const {authenticateAdmin} = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('login', login);
router.get('/profie', authenticateAdmin, getProfile);
router.get('/students', authenticateAdmin, getStudents);
router.post('/task', authenticateAdmin, assignTask);
router.get('/announcement', authenticateAdmin, createAnnouncement);
router.get('/announcements', authenticateAdmin, getAnnouncement);

module.exports = router;