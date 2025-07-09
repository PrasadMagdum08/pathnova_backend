const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrUpdateProfile, getProfile } = require('../controllers/profileController');

router.post('/', authMiddleware, createOrUpdateProfile);
router.get('/', authMiddleware, getProfile);

module.exports = router;
