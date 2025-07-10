const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {course} = require('../controllers/courseController');


router.get('/recommendations', authenticate, course);
  
module.exports = router;
