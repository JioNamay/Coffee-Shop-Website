const express = require('express');
const { check, validationResult} = require('express-validator');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secrets = (process.env.NODE_ENV !== 'production') ? require("../secrets") : undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;
const tokenKey = process.env.TOKEN_KEY || secrets.tokenKey;

const pool = new Pool({
    connectionString: databaseConnectionString,
    ssl: false
});

router.post(
    "/login",
    [
        check("username", "Username required").not().isEmpty(),
        check("password", "Password required").not().isEmpty()
    ],
    async (req, res) => {
        try {
            // Check for errors in request
            if (!validationResult(req).isEmpty()) {
                // Outputting errors
                return res.status(400).json({ errors: validationResult(req).array() });
            }

            const { username, password } = req.body;

            const salt = await bcrypt.genSalt(8);
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log(hashedPassword);

            console.log(username);
            console.log(password);

            // Check for valid email
            const db = await pool.connect();
            const validUserQuery = `SELECT * FROM administrators WHERE username='${username}';`;
            const validUser = await db.query(validUserQuery);
            const result = validUser ? validUser.rows : null;
            if (result.length === 0) {
                return res.status(400).send({ errors: "INVALID_LOGIN" });
            }

            // Check for valid password
            const passwordResult = result[0].password;
            const passwordMatches = await bcrypt.compare(password, passwordResult);
            if (!passwordMatches) {
                return res.status(400).json({ errors: "INVALID_LOGIN" });
            }

            // Successful login
            db.release();

            return res.status(200).json({adminId: result[0].adminid, username: username})
        } catch (error) {
            return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
        }
    }
);

// Checks that an admin exists with username and password "admin"
router.post(
    "/setup",
    async (req, res) => {
        console.log("here");
        try {

            const { username, password } = {username: 'admin', password: 'admin'};

            // Check if user already exists
            const db = await pool.connect();
            const checkExistsQuery = `SELECT * FROM administrators WHERE username='${username}';`;
            const checkExists = await db.query(checkExistsQuery);
            const result = checkExists ? checkExists.rows : null;
            if (result.length > 0) {
                return;
            }

            // Create the user
            const adminId = uuid.v4();
            const salt = await bcrypt.genSalt(8);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertUserQuery =
                `INSERT INTO administrators(adminId, username, password) ` +
                `VALUES ('${adminId}', '${username}', '${hashedPassword}');`;
            await db.query(insertUserQuery);

            db.release();

            console.log("admin created")

        } catch (error) {
            console.log(error);
        }
    }
);

module.exports = router;

//app.use('/api/admin', require('./routes/admin'));

// CREATE TABLE administrators
// (
//     adminID UUID NOT NULL,
//     username VARCHAR(256) NOT NULL,
//     password VARCHAR(128) NOT NULL,
//     PRIMARY KEY (userId)
// );

