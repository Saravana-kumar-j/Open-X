const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Adjust the path to your model
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'openx_sarky';
mongoose.connect('mongodb+srv://admin:admin@atlascluster.rklqnjm.mongodb.net/openx')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/register', (req, res) => {
    console.log("Register API hit");

    const { userName, address } = req.body;

    if (!userName || !address) {
        return res.status(400).json({ message: 'Username and address are required' });
    }

    User.findOne({ address })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

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

    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ message: 'Metamask account is required.' });
    }

    User.findOne({ address })
        .then(existingUser => {
            if (!existingUser) {
                return res.status(400).json({ message: 'User not found. Kindly register.' });
            }

            const token = jwt.sign(
                { userName: existingUser.userName, address: existingUser.address },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, userName: existingUser.userName });
        })
        .catch(error => {
            console.error('Error during Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

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

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = app;
module.exports.handler = serverless(app);
