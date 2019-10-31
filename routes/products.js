const express = require("express");
const { Router } = "express";
const { check, validationResult } = require("express-validator");
const { Pool } = require("pg");

const router = express.Router();

// Database
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// GET all products
router.get("/", (req, res) => {
    const client = await pool.connect();
    const userQuery = "SELECT * FROM products";
    const result = await client.query(userQuery);
    res.status(200).json(result.rows);
});
