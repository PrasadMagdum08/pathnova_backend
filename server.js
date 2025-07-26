// .. dependencies
const http = require('http');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');

// .. modules
const Chat = require('./models/Chat');
const Message = require('./models/Message');

// .. app
const app = require('./app');

// .. server
const server = http.createServer(app);

dotenv.config();

const io = socketio(Server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
});

// .. Socket connection logic
const connectedUsers = new Map();
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if(!token) return next(new Error('Auth token missing'));

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user;
        next();
    }
    catch (error) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    const userId = socket.user.id;
    connectedUsers.set(userId, socket.id);

    console.log(`User connected: ${userId}`);
    socket.join(userId);

    socket.on('send message', async ({chatId, content}) => {
        try{
            const message = await Message.create({
                chat: chatId,
                sender: userId,
                content,
            });
            await Chat.findByIdAndUpdate(chatId, {lastMessage: message._id});

            io.to(chatId).emit('receive_message', message);
        } catch (error) {
            console.error(`Error sending message: ${error.message}`);
        }
    });

    socket.on('typing', ({ chatId }) => {
        socket.to(chatId).emit('typing', {userId});
    });

    socket.on('stop_typing', ({ chatId }) => {
        socket.to(chatId).emit('stop_typing', {userId});
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
    });
});


// .. server running
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on `);
});