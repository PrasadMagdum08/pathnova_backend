// pathnova_node_backend/models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: String,
    email: String,
    whatsapp: Number,
}, {timestamps: true});

module.exports = mongoose.model('Admin', AdminSchema);