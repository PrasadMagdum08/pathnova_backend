const Profile = require('../models/Profile');

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
    portfolio_building_duration
  } = req.body;

  const userId = req.user.id;

  try {
    const updated = await Profile.findOneAndUpdate(
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
        portfolio_building_duration
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};
