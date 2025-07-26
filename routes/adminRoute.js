// pathnova_node_backend/routes/adminRoute.js
const express = require('express')
const router = express.Router();
const {
    // register,
    // login,
    getProfile,
    getStudents,
    assignTask,
    createAnnouncement,
    getAnnouncements
} = require('../controllers/adminController')
const authenticate = require('../middlewares/authMiddleware');

// router.post('/register', register);
// router.post('login', login);
router.get('/profie', authenticate, getProfile);
router.get('/students', authenticate, getStudents);
router.post('/task', authenticate, assignTask);
router.get('/announcement', authenticate, createAnnouncement);
router.get('/announcements', authenticate, getAnnouncements); 

module.exports = router;