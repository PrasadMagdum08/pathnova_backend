// pathnova_node_backend/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    college: String,
    semester: String, 
    current_major: String,
    batch: String,
    intended_specialized_major: String,
    skills: [String],
    upskilling: [String],
    portfolio_url: [String],
    portfolio_building_duration: Number,

    profileImageUrl: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
}, {timestamps: true});

module.exports = mongoose.model('Student', StudentSchema);