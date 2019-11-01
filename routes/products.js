const express = require("express");
const { Router } = "express";
const Joi = require("@hapi/joi"); // joi validation tool
const { Pool } = require("pg");

const router = express.Router();

// Database
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const userQuery = "SELECT * FROM products";
    const result = await client.query(userQuery);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).send("Something went wrong.");
  }
});

// GET a specific product
router.get("/:id", async (req, res) => {
  try {
    // if the id is not a number, send an error
    const productId = parseInt(req.params.id);
    if (Number.isNaN(productId))
      return res.status(400).send("The ID must be a number.");

    const client = await pool.connect();
    const existsQuery = `SELECT EXISTS(SELECT id FROM products WHERE id = '${productId}')`;
    const existsResult = await client.query(existsQuery);

    // if the task does not exist, send an error
    const taskExists = existsResult.rows[0].exists;
    if (!taskExists)
      return res.status(404).send("The task with the given ID was not found.");

    // retrieve the task from the database
    const retrieveQuery = `SELECT * FROM products WHERE id = '${productId}'`;
    const retrieveResult = await client.query(retrieveQuery);
    client.release();
    res.status(200).json(retrieveResult.rows[0]); // send the task
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

router.post("/", async (req, res) => {});

/**
 * Validates the POST request body using the POST request body schema.
 * @param {object} product
 * @return {ValidationResult<any>} The joi validation result.
 */
function validatePostProduct(product) {
  const schema = {
    name: Joi.string()
      .min(1) // minimum 1 character required
      .required(), // name is mandatory
    price: Joi.number()
      .positive() // must be a positive number
      .precision(2) // maximum 2 decimal places
      .required(), // price is mandatory
    stock: Joi.number()
      .integer() // must be an integer
      .min(0) // must be >= 0
      .empty(null) // if null, make it undefined
      .default(0) // if stock undefined, set it to 0
  };

  return Joi.validate(product, schema);
}

module.exports = router;
