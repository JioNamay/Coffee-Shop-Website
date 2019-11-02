const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi"); // joi validation tool

const router = express.Router();

//const secrets = require('../secrets');
const secrets = undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;
const tokenKey = process.env.TOKEN_KEY || secrets.tokenKey;

const pool = new Pool({
  connectionString: databaseConnectionString,
  ssl: false
});

router.get("/", async (req, res) => {
  try {
    const db = await pool.connect();
    const allItemsQuery = `SELECT * FROM items;`;
    const allItems = await db.query(allItemsQuery);

    const result = allItems ? allItems.rows : null;

    db.release();
    return res.status(200).json({ items: result });
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// GET a specific product
router.get("/:id", async (req, res) => {
  try {
    // if the id is not a number, send an error
    const productId = parseInt(req.params.id);
    if (Number.isNaN(productId))
      return res.status(400).json({ errors: "The ID must be a number." });

    // check that the product exists
    const db = await pool.connect();
    const existsQuery = `SELECT EXISTS(SELECT itemId FROM items WHERE itemId = '${productId}')`;
    const existsResult = await db.query(existsQuery);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .json({ errors: "The product with the given ID was not found." });

    // retrieve the product from the database
    const retrieveQuery = `SELECT * FROM items WHERE itemId = '${productId}'`;
    const retrieveResult = await db.query(retrieveQuery);
    db.release();
    res.status(200).json({ items: retrieveResult.rows[0] }); // send the product
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// POST a product
router.post("/", async (req, res) => {
  try {
    const result = validatePostProduct(req.body);
    const { value } = result;
    const { error } = result;
    // if there was an error with the validation, send an error
    if (error)
      return res.status(400).json({ errors: error.details[0].message });

    const client = await pool.connect();
    const insertQuery = `INSERT INTO items (name, description, price, image) VALUES ('${value.name}', '${value.description}', '${value.price}', '${value.image}'); SELECT currval('items_itemId_seq')`;
    const insertResult = await client.query(insertQuery);

    // retrieve the newly added product
    const productId = insertResult[1].rows[0].currval;
    const retrieveQuery = `SELECT * FROM items WHERE itemId = '${productId}'`;
    const retrieveResult = await client.query(retrieveQuery);
    client.release();

    res.status(201).json(retrieveResult.rows[0]); // as a best practice, send the posted product as a response
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

async function verifyToken(token) {
  return await jwt.verify(token, tokenKey, (error, tokenData) => {
    if (error) {
      throw new Error("INVALID_TOKEN");
    } else {
      return tokenData.userData.userId;
    }
  });
}

router.get("/cart", async (req, res) => {
  try {
    // Verify token
    const token = req.headers["authorization"];
    const userId = await verifyToken(token);

    const db = await pool.connect();
    const cartQuery = `SELECT cartitemid, itemid, name, description, price, image FROM cart NATURAL JOIN users INNER JOIN items ON item=items.itemid WHERE buyer='${userId}';`;
    const cart = await db.query(cartQuery);
    const cartResults = cart ? cart.rows : null;

    db.release();
    return res.status(200).json({ cart: cartResults });
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(403).json({ errors: "INVALID_TOKEN" });
    }
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { cartItemId, itemId } = req.body;

    // Verify token
    const token = req.headers["authorization"];
    const userId = await verifyToken(token);

    // Insert into database
    const db = await pool.connect();
    const insertCartQuery = `INSERT INTO cart (cartItemId, buyer, item) VALUES ('${cartItemId}', '${userId}', '${itemId}');`;
    await db.query(insertCartQuery);
    db.release();

    return res.status(201);
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(403).json({ errors: "INVALID_TOKEN" });
    }
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

router.delete("/cart/:cart_item_id", async (req, res) => {
  try {
    // Verify token
    const token = req.headers["authorization"];
    await verifyToken(token);

    const cartItemId = req.params.cart_item_id;

    // Delete the item from the cart table
    const db = await pool.connect();
    const deleteCartQuery = `DELETE from cart where cartitemid='${cartItemId}';`;
    await db.query(deleteCartQuery);

    db.release();
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
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
    description: Joi.string()
      .empty(null) // if null, make it undefined
      .default("covfefe"), // if description undefined, set it to covfefe
    price: Joi.number()
      .positive() // must be a positive number
      .precision(2) // maximum 2 decimal places
      .required(), // price is mandatory
    image: Joi.string()
      .uri() // must be a valid RFC 3986 URI
      .empty(null) // if null, make it undefined
      .default(
        "https://www.joyfulhealthyeats.com/wp-content/uploads/2018/04/Sweet-Cream-Iced-Coffee-web-9.jpg"
      ) // if image undefined, set it to this default image
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
    description: Joi.string().default(oldProduct.description), // if undefined, do not change the description
    price: Joi.number()
      .positive() // must be a positive number
      .precision(2) // maximum 2 decimal places
      .default(oldProduct.price), // if undefined, do not change the price
    image: Joi.string()
      .uri() // must be a valid RFC 3986 URI
      .default(oldProduct.image) // if undefined, do not change the image
  };

  return Joi.validate(newProduct, schema);
}

module.exports = router;
