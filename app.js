const express = require('express')
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json()); // For parsing application/json

require('dotenv').config();

// --- Sample Data Store ---
const users = [];

app.post(
  '/users',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }

    const { email, password } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(409).json({
        status: false,
        message: 'User already exists'
      });
    }

    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);

    return res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: newUser
    });
  }
);

// --- Start Server ---
// const PORT = 3033;
//process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
