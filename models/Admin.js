// pathnova_node_backend/models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},
    name: String,
    email: String,
    whatsapp: Number,
}, {timestamps: true});

module.exports = mongoose.model('Admin', AdminSchema);