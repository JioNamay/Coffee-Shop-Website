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

    // check that the product exists
    const client = await pool.connect();
    const existsQuery = `SELECT EXISTS(SELECT id FROM products WHERE id = '${productId}')`;
    const existsResult = await client.query(existsQuery);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .send("The product with the given ID was not found.");

    // retrieve the product from the database
    const retrieveQuery = `SELECT * FROM products WHERE id = '${productId}'`;
    const retrieveResult = await client.query(retrieveQuery);
    client.release();
    res.status(200).json(retrieveResult.rows[0]); // send the product
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

// POST a product
router.post("/", async (req, res) => {
  try {
    const result = validatePostProduct(req.body);
    const { value } = result;
    const { error } = result;
    // if there was an error with the validation, send an error
    if (error) return res.status(400).send(error.details[0].message);

    const client = await pool.connect();
    const insertQuery = `INSERT INTO products (name, price, stock) VALUES ('${value.name}', '${value.price}', '${value.stock}'); SELECT currval('products_id_seq')`;
    const insertResult = await client.query(insertQuery);

    // retrieve the newly added product
    const productId = insertResult[1].rows[0].currval;
    const retrieveQuery = `SELECT * FROM products WHERE id = '${productId}'`;
    const retrieveResult = await client.query(retrieveQuery);
    client.release();

    res.status(201).json(retrieveResult.rows[0]); // as a best practice, send the posted product as a response
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

// PUT (update) a specific product
router.put("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (Number.isNaN(productId))
      return res.status(400).send("The ID must be a number.");

    // check that the product exists
    const client = await pool.connect();
    const existsQuery = `SELECT EXISTS(SELECT id FROM products WHERE id = '${productId}')`;
    const existsResult = await client.query(existsQuery);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .send("The product with the given ID was not found.");

    // product exists; get it so that we can validate against it and send it as a response
    const retrieveQuery = `SELECT * FROM products WHERE id = '${productId}'`;
    const retrieveResult = await client.query(retrieveQuery);
    let product = retrieveResult.rows[0];

    const validationResult = validatePutProduct(product, req.body);
    const { value } = validationResult;
    const { error } = validationResult;
    // if there was an error with the validation, send an error
    if (error) return res.status(400).send(error.details[0].message);

    // update the product in the database
    const updateQuery = `UPDATE products SET name = ${value.name}, price = ${value.price}, stock = ${value.stock} WHERE id = '${productId}'`;
    const updateResult = await client.query(updateQuery);

    product.name = value.name;
    product.price = value.price;
    product.stock = value.stock;
    client.release();

    res.status(200).send(product); // as a best practice, send the updated product as a response
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

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

/**
 * Validates the PUT request body using the PUT request body schema.
 * @param {object} oldProduct
 * @param {object} newProduct
 * @return {ValidationResult<any>} The joi validation result.
 */
function validatePutProduct(oldProduct, newProduct) {
  const schema = {
    name: Joi.string()
      .min(1) // minimum 1 character required
      .default(oldProduct.name), // if undefined, do not change the name
    price: Joi.number()
      .positive() // must be a positive number
      .precision(2) // maximum 2 decimal places
      .default(oldProduct.price), // if undefined, do not change the price
    stock: Joi.number()
      .integer() // must be an integer
      .min(0) // must be >= 0
      .default(oldProduct.stock) // if undefined, do not change the stock
  };

  return Joi.validate(newProduct, schema);
}

module.exports = router;
