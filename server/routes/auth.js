const express = require ('express');
const router = express.Router();
const User = require('../models/User');

// for registering 
router.post('/register',async(req,res)=>
{
    try{
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    }
    catch(err){
        console.error(err);
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
});

// for login
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Use bcrypt to compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
    }
    catch(err) {
        console.error(err);
        res.status(400).json({ message: 'Error logging in', error: err.message });
    }
});

module.exports = router;
