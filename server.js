// .. dependencies
const http = require('http');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// .. app
const app = require('./app');

// .. server
const server = http.createServer(app);

dotenv.config();

// .. server running
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on `);
});