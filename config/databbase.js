// pathnova_node_backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    }
    catch (error){
        console.error(`MongoDB connection failes: ${error.message}`);
        porocess.env.exit(1);
    }
};

module.exports = connectDB;