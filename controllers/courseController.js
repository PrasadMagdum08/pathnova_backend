// routes/courses.js
const axios = require('axios');
const {token_fetch} = require('../controllers/authController');

exports.course = async (req, res) => {
    const idToken = token_fetch.token;

    try {
        const response = await axios.get('https://pathnova-backend.onrender.com/api/courses/recommendations/', {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Django recommendation fetch error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
        error: 'Failed to fetch recommendations',
        detail: error.response?.data || null
        });
    }
};

// 
