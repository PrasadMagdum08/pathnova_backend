const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, updateProfileImage } = require('../controllers/profileController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, createOrUpdateProfile);
router.get('/', authenticate, getProfile);
router.patch('/image', authenticate, updateProfileImage);

module.exports = router;
