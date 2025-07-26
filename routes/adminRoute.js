// pathnova_node_backend/routes/adminRoute.js
const express = require('express')
const router = express.Router();
const {
    createOrUpdateAdminProfile,
    getProfile,
    getStudents,
    assignTask,
    createAnnouncement,
    getAnnouncements
} = require('../controllers/adminController')
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, createOrUpdateAdminProfile);
router.get('/profie', authenticate, getProfile);
router.get('/students', authenticate, getStudents);
router.post('/task', authenticate, assignTask);
router.get('/announcement', authenticate, createAnnouncement);
router.get('/announcements', authenticate, getAnnouncements); 

module.exports = router;