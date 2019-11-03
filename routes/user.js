const express = require('express');
const { check, validationResult} = require('express-validator');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secrets = require('../secrets');
//const secrets = undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;
const tokenKey = process.env.TOKEN_KEY || secrets.tokenKey;

const pool = new Pool({
  connectionString: databaseConnectionString,
  ssl: false
});


router.post(
  '/signup',
  [
    check('firstName', 'First name must not be empty').not().isEmpty(),
    check('lastName', 'Last name must not be empty').not().isEmpty(),
    check('email', 'Email required').isEmail(),
    check('password', 'Password must be at least 5 characters').isLength({ min: 5 })
  ],
  async (req, res) => {
    try {
      // Check for errors in request
      if(!validationResult(req).isEmpty()) {
        // Outputting errors
        return res.status(400).json({ errors: validationResult(req).array() });
      }

      const {
        firstName,
        lastName,
        email,
        password
      } = req.body;

      // Check if user already exists
      const db = await pool.connect();
      const checkExistsQuery = `SELECT * FROM users WHERE email='${email}';`;
      const checkExists = await db.query(checkExistsQuery);
      const result = (checkExists) ? checkExists.rows : null;
      if (result.length > 0) {
        return res.status(400).json({ errors: 'EMAIL_EXISTS' });
      }

      // Create the user
      const userId = uuid.v4();
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(password, salt);

      const insertUserQuery =
        `INSERT INTO users(userId, firstName, lastName, email, password) ` +
        `VALUES ('${userId}', '${firstName}', '${lastName}', '${email}', '${hashedPassword}');`;
      await db.query(insertUserQuery);

      db.release();
      return res.status(201).send('User created');
    } catch (error) {
      return res.status(500).json({ errors: 'INTERNAL_SERVER_ERROR' });
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Email required').isEmail(),
    check('password', 'Password required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      // Check for errors in request
      if(!validationResult(req).isEmpty()) {
        // Outputting errors
        return res.status(400).json({ errors: validationResult(req).array() });
      }

      const {
        email,
        password
      } = req.body;

      // Check for valid email
      const db = await pool.connect();
      const validEmailQuery = `SELECT * FROM users WHERE email='${email}';`;
      const validEmail = await db.query(validEmailQuery);
      const result = (validEmail) ? validEmail.rows : null;
      if (result.length === 0) {
        return res.status(400).send({ errors: 'INVALID_LOGIN' });
      }

      // Check for valid password
      const passwordResult = result[0].password;
      const passwordMatches = await bcrypt.compare(password, passwordResult);
      if (!passwordMatches) {
        return res.status(400).json({ errors: 'INVALID_LOGIN' });
      }

      // Successful login
      db.release();
      jwt.sign(
        {
          userData: {
            userId: result[0].userid,
            firstName: result[0].firstname,
            lastName: result[0].lastname,
            email: result[0].email
          }
        },
        tokenKey,
        {
          expiresIn: '5h'
        },
        (error, token) => {
          return res.status(200).json({
            token: token,
            userId: result[0].userid,
            firstName: result[0].firstname,
            lastName: result[0].lastname,
            email: result[0].email
          });
        }
      );

    } catch (error) {
      return res.status(500).json({ errors: 'INTERNAL_SERVER_ERROR' });
    }
  }
);

router.post('/tokenlogin', async (req, res) => {
  try {
    const {
      token
    } = req.body;

    jwt.verify(token, tokenKey, (error, tokenData) => {
      if (error) {
        return res.status(403).json({ errors: 'INVALID_TOKEN' });
      } else {
        return res.status(200).json({
          userId: tokenData.userData.userId,
          firstName: tokenData.userData.firstName,
          lastName: tokenData.userData.lastName,
          email: tokenData.userData.email
        });
      }
    })

  } catch (error) {
    return res.status(500).json({ errors: 'INTERNAL_SERVER_ERROR' });
  }
});

module.exports = router;
