const express = require('express')
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json()); // For parsing application/json


const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');
const userModel = require('./userModel');

const db = require('./db');

db.getDatabase();


require('dotenv').config();

// --- Sample Data Store ---
const users = [];

// app.post(
//   '/users',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Email must be valid'),
//     body('password')
//       .isLength({ min: 6 })
//       .withMessage('Password must be at least 6 characters long'),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({
//         status: false,
//         message: 'Validation error',
//         errors: errors.array().map(err => ({
//           field: err.param,
//           message: err.msg
//         }))
//       });
//     }

//     const { email, password } = req.body;
//     const userExists = users.find(u => u.email === email);
//     if (userExists) {
//       return res.status(409).json({
//         status: false,
//         message: 'User already exists'
//       });
//     }

//     const newUser = { id: users.length + 1, email, password };
//     users.push(newUser);

//     return res.status(201).json({
//       status: true,
//       message: 'User created successfully',
//       data: newUser
//     });
//   }
// );

// --- Start Server ---
// const PORT = 3033;
//process.env.PORT

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!(email && password && name)) {
            return res.status(400).json({ error: 'All input is required' });
        }

        const oldUser = await userModel.findOne({ email });
        if (oldUser) {
            return res.status(409).json({ error: 'User Already Exists. Please Login' });
        }

       
        const user = await userModel.create({
            name,
            email: email.toLowerCase(),
            password: password
        });

        
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ error: 'All input is required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User Not Found' });
        }

        // Direct password comparison (not recommended for production)
        if (password === user.password) {
             const token = jwt.sign(
            { user_id: user._id, email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

            return res.status(200).json({ user,token });
        }
        res.status(400).json({ error: 'Invalid Credentials' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
