const express = require("express");
const {check, validationResult} = require("express-validator");
const {Pool} = require("pg");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const {adminAuth} = require("../util/adminUtils");

const router = express.Router();

const secrets =
  process.env.NODE_ENV !== "production" ? require("../secrets") : undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;
const tokenKey = process.env.TOKEN_KEY || secrets.tokenKey;

const pool = new Pool({
  connectionString: databaseConnectionString,
  ssl: false
});

router.post(
  "/login",
  [
    check("username", "Username required")
      .not()
      .isEmpty(),
    check("password", "Password required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      // Check for errors in request
      if (!validationResult(req).isEmpty()) {
        // Outputting errors
        return res.status(400).json({errors: validationResult(req).array()});
      }

      const {username, password} = req.body;

      const salt = await bcrypt.genSalt(8);

      // Check for valid email
      const db = await pool.connect();
      const validUserQuery = "SELECT * FROM administrators WHERE username=$1;";
      const validUser = await db.query(validUserQuery, [username]);
      const result = validUser ? validUser.rows : null;
      if (result.length === 0) {
        return res.status(400).send({errors: "INVALID_LOGIN"});
      }

      // Check for valid password
      const passwordResult = result[0].password;
      const passwordMatches = await bcrypt.compare(password, passwordResult);
      if (!passwordMatches) {
        return res.status(400).json({errors: "INVALID_LOGIN"});
      }

      // Successful login
      db.release();

      return res
        .status(200)
        .json({adminId: result[0].adminid, username: username});
    } catch (error) {
      return res.status(500).json({errors: "INTERNAL_SERVER_ERROR"});
    }
  }
);

// Checks that an admin exists with username and password "admin"
router.post("/setup", async (req, res) => {
  try {
    const {username, password} = {username: "admin", password: "admin"};

    // Check if user already exists
    const db = await pool.connect();
    const checkExistsQuery = "SELECT * FROM administrators WHERE username=$1;";
    const checkExists = await db.query(checkExistsQuery, [username]);
    const result = checkExists ? checkExists.rows : null;
    if (result.length > 0) {
      return;
    }

    // Create the user
    const adminId = uuid.v4();
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUserQuery =
      "INSERT INTO administrators(adminId, username, password) VALUES ($1, $2, $3);";
    await db.query(insertUserQuery, [adminId, username, hashedPassword]);

    db.release();

    console.log("admin created");
  } catch (error) {
    console.log(error);
  }
});

// returns json containing all users and their data (except for password)
router.get(
  "/users",
  async (req, res) => {
    const auth = req.headers["auth"];
    // do the auth
    if (!await adminAuth(auth)) {
      return res.status(401).json({errors: "UNAUTHORIZED_ACTION"});
    }
    try {
      // get all the users (all info other than password)
      const db = await pool.connect();
      const query = `SELECT userID, email, firstName, lastName FROM users;`;
      const allUsers = await db.query(query);
      const result = allUsers ? allUsers.rows : null;

      // return the users as json.
      db.release();
      return res.status(200).json({users: result});

    } catch (error) {
      console.log(error);
      return res.status(500).json({errors: "INTERNAL_SERVER_ERROR"});
    }
  }
);

// returns json containing all user data (except password) and all their orders
router.get(
  "/user/:userId",
  async (req, res) => {
    const auth = req.headers["auth"];
    // do the auth
    if (!await adminAuth(auth)) {
      return res.status(401).json({errors: "UNAUTHORIZED_ACTION"});
    }
    try {
      // get userId from url
      const userId = req.params.userId;

      const db = await pool.connect();

      // get the user information
      const query = `SELECT userID, email, firstName, lastName FROM users WHERE userID=$1;`;
      const user = await db.query(query, [userId]);
      const userResult = user ? user.rows : null;

      // get the order history of the user
      const orderHistoryQuery =
        "SELECT orderitemid, itemid, name, description, price, image, dateordered FROM orders INNER JOIN users ON orders.buyer=users.userid INNER JOIN items ON item=items.itemId WHERE buyer=$1;";
      const orderHistory = await db.query(orderHistoryQuery, [userId]);
      const orderHistoryResults = orderHistory ? orderHistory.rows : null;

      db.release();

      // return the information as json.
      return res.status(200).json({user: userResult, orderHistory: orderHistoryResults});

    } catch (error) {
      console.log(error);
      return res.status(500).json({errors: "INTERNAL_SERVER_ERROR"});
    }
  }
);

// deletes the order related to the id in the url
router.delete(
  "/order/:orderId",
  async (req, res) => {
    const auth = req.headers["auth"];
    // do the auth
    if (!await adminAuth(auth)) {
      return res.status(401).json({errors: "UNAUTHORIZED_ACTION"});
    }
    try {
      // get orderId from params
      const orderId = req.params.orderId;

      const db = await pool.connect();

      // check that the order exists
      const existsQuery = `SELECT * FROM orders WHERE orderItemId=$1`;
      const exists = await db.query(existsQuery, [orderId]);
      const existsResult = exists ? exists.rows : null;
      if (!existsResult.length > 0) {
        return res.status(404).json({errors: "ORDER_NOT_FOUND"});
      }

      // delete product from database
      const deleteQuery = "DELETE FROM orders WHERE orderItemId=$1";
      await db.query(deleteQuery, [orderId]);

      db.release();

      // return the deleted order as json.
      return res.status(200).json({order: existsResult});

    } catch (error) {
      console.log(error);
      return res.status(500).json({errors: "INTERNAL_SERVER_ERROR"});
    }
  }
);

module.exports = router;
