// pathnova_node_backend/controllers/chatController.js

const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [myId, userId], $size: 2 }
    })
      .populate('participants', '-password')
      .populate('lastMessage');

    if (!chat) {
      chat = await Chat.create({
        participants: [myId, userId],
        isGroupChat: false
      });
    }

    res.json(chat);
  } catch (err) {
    console.error('Access chat error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err.message);
    res.status(500).json({ error: 'Failed to load messages' });
  }
};
