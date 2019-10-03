const express = require('express');
const { Router } = 'express';
const { check, validationResult} = require('express-validator');
const { Pool } = require('pg');

const router = express.Router();

// Database
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

router.get('/', (req, res) => {
  res.send('Hello');
});

router.post('/signup',
  [
    check('email', 'Email must be valid').isEmail(),
    check('password', 'Password must be 5 or more characters').isLength({ min: 5 })
  ],
  async (req, res) => {
  try {
    // Detect errors in res
    const requestErrors = validationResult(req);
    if (!requestErrors.isEmpty()) {
      return res.status(400).json({error: requestErrors.array()});
    }

    // Search for existing user
    const client = await pool.connect();

    const existingQuery = `SELECT * FROM USERS WHERE email=${req.body.email}`;
    const result = await client.query(existingQuery);
    if (result.rows) {
      return res.status(400).json({ error: [{msg: 'Email already exists'}] });
    }

    // Create user
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const signupQuery = `INSERT INTO USERS (email, password) VALUES (${req.body.email}, ${hashedPassword})`;
    await client.query(signupQuery);

    client.release();
    return res.status(201).send('Signup Successful');

  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
});

router.post('/login',
  [
    check('email', 'Enter an email').isEmail(),
    check('password', 'Enter the password').exists()
  ],
  async (req, res) => {
    try {
      // Detect errors in res
      const requestErrors = validationResult(req);
      if (!requestErrors.isEmpty()) {
        return res.status(400).json({ error: requestErrors.array });
      }

      // Get user
      const client = await pool.connect();

      const userQuery = `SELECT * FROM USERS WHERE email=${req.body.email}`;
      const result = await client.query(userQuery);
      if (!result.rows) {
        return res.status(400).json({ error: [{msg: 'User does not exist'}] });
      }

      const user = result.rows;
      console.log(user);

      // Get the user password
      const password = 'temporary';
      const correctPassword = await bcrypt.compare(req.body.password, password);

      if (correctPassword) {
        // Return the json for correct login
        
      } else {
        return res.status(400).json({ error: [{msg: 'Wrong password' }]})
      }

    } catch (error) {
      return res.status(500).send('Something went wrong');
    }
  }
);

router.post('/logout', async (req, res) => {
  try {
    // Do logout

  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
});


module.exports = router;
