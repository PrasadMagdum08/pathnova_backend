// controllers/courseController.js
const axios = require("axios");

exports.course = async (req, res) => {
  try {
    // ✅ Extract token from incoming request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 🔁 Forward the token to Django recommendation API
    const response = await axios.get("https://pathnova-backend.onrender.com/api/courses/recommendations/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Django recommendation fetch error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: "Failed to fetch recommendations",
      detail: error.response?.data || null,
    });
  }
};
