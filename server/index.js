const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Assuming you have a User model defined
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin: 'https://open-x-frontend.vercel.app/', // Replace with your frontend's origin
//     methods: ['GET', 'POST'],
//     // allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   }));
const JWT_SECRET = process.env.JWT_SECRET
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.post('/register', (req, res) => {
    console.log("Register API hit");

    const { userName, address } = req.body;

    // Validate input
    if (!userName || !address) {
        return res.status(400).json({ message: 'Username and address are required' });
    }

    // Check if the address is already registered
    User.findOne({ address })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
                
            }

            // Create a new user if address is not found
            return User.create({ userName, address })
                .then(newUser => {
                    res.status(201).json({ message: `${newUser.userName} registered successfully` });
                });
        })
        .catch(error => {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/login', (req, res) => {
    console.log("Login API hit");

    const { address } = req.body; // Changed to correctly match the key used in the request

    // Check if the address is provided
    if (!address) {
        return res.status(400).json({ message: 'Metamask account is required.' });
    }

    // Find the user by the provided address
    User.findOne({ address })
        .then(existingUser => {
            if (!existingUser) {
                return res.status(400).json({ message: 'User not found. Kindly register.' });
            }

            // If user is found, send back the username
            const token = jwt.sign(
                { userName: existingUser.userName, address: existingUser.address },
                JWT_SECRET,
                { expiresIn: '1h' } // Token expires in 1 hour
            );
    
            res.status(200).json({ token, userName: existingUser.userName });
        })
        .catch(error => {
            console.error('Error during Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is Running on port 3001.");
});
