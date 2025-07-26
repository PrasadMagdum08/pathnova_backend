// pathnova_backend/controllers/profileController.js
const Student = require('../models/Student');

// Create or update the user's full profile
exports.createOrUpdateProfile = async (req, res) => {
  const {
    name,
    email,
    college,
    semester,
    current_major,
    batch,
    intended_specialized_major,
    skills,
    upskilling,
    portfolio_url,
    portfolio_building_duration,
    profileImageUrl // Optional in request body
  } = req.body;

  const userId = req.user?.id;

  try {
    const existingProfile = await Student.findOne({ userId });

    const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // fallback image

    const updatedProfile = await Student.findOneAndUpdate(
      { userId },
      {
        name,
        email,
        college,
        semester,
        current_major,
        batch,
        intended_specialized_major,
        skills,
        upskilling,
        portfolio_url,
        portfolio_building_duration,
        profileImageUrl: profileImageUrl || existingProfile?.profileImageUrl || defaultImage,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Get current user's profile
exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await Student.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update only the profile image
exports.updateProfileImage = async (req, res) => {
  const userId = req.user.id;
  const { profileImageUrl } = req.body;

  if (!profileImageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    const updated = await Student.findOneAndUpdate(
      { userId },
      { profileImageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile image updated', profileImageUrl });
  } catch (err) {
    console.error("Image update error:", err.message);
    res.status(500).json({ message: 'Error updating profile image' });
  }
};
