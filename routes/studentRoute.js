// pathnova_backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, updateProfileImage } = require('../controllers/studentController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, createOrUpdateProfile);
router.get('/fetch_profile', authenticate, getProfile);
router.patch('/image', authenticate, updateProfileImage);

module.exports = router;
