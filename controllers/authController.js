// pathnova_node_backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {name, email, password, role} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log(`User already exits with email: ${existingUser}`);
            return res.status(400).json({message: 'User already exits'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        console.log(`User registered successfully: ${user}`);
        console.log(`Generated token: ${token}`);
        res.status(201).json({ token, user });
    }
    catch (error){
        console.log(`Error during registration: ${error}`);
        res.status(500).json({ message: 'Server error' })
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid Credentials'});

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email,
        }, 
        process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.status(200).json({token, user});
    }
    catch(error){
        console.log(`Error during login: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};