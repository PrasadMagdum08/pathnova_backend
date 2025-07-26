// pathnova_node_backend/models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    chatName: {type: String},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messsage',
    },
}, {timestampes: true});

module.exports = mongoose.model('Chat', ChatSchema);