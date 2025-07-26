// pathnova_node_backend/app.js
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/databbase')

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/admin', require('./routes/adminRoute'))
app.use('/api/student', require('./routes/studentRoute'))


module.exports = app;