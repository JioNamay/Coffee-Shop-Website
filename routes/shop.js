const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi"); // Joi validation tool

const router = express.Router();

const secrets =
  process.env.NODE_ENV !== "production" ? require("../secrets") : undefined;
const databaseConnectionString = process.env.DATABASE_URL || secrets.database;
const tokenKey = process.env.TOKEN_KEY || secrets.tokenKey;

const pool = new Pool({
  connectionString: databaseConnectionString,
  ssl: false
});

router.get("/items", async (req, res) => {
  try {
    const db = await pool.connect();
    const allItemsQuery = "SELECT * FROM items;";
    const allItems = await db.query(allItemsQuery);

    const result = allItems ? allItems.rows : null;

    db.release();
    return res.status(200).json({ items: result });
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// GET a specific product
router.get("/items/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // check that the product exists
    const db = await pool.connect();
    const existsQuery =
      "SELECT EXISTS(SELECT itemId FROM items WHERE itemId = $1)";
    const existsResult = await db.query(existsQuery, [productId]);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .json({ errors: "The product with the given ID was not found." });

    // retrieve the product from the database
    const retrieveQuery = "SELECT * FROM items WHERE itemId = $1";
    const retrieveResult = await db.query(retrieveQuery, [productId]);
    db.release();
    res.status(200).json({ items: retrieveResult.rows[0] }); // send the product
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// POST a product
router.post("/items", async (req, res) => {
  try {
    const result = validatePostProduct(req.body);
    const { value } = result;
    const { error } = result;
    // if there was an error with the validation, send an error
    if (error)
      return res.status(400).json({ errors: error.details[0].message });

    const db = await pool.connect();

    // check if an item with that itemId already exists
    const existsQuery =
      "SELECT EXISTS(SELECT itemId FROM items WHERE itemId = $1)";
    const existsResult = await db.query(existsQuery, [value.itemId]);

    // if the itemId is already in use, send an error
    const productExists = existsResult.rows[0].exists;
    if (productExists)
      return res.status(409).json({
        errors:
          "There is already an item with that itemId. itemId must be unique."
      });

    const insertQuery =
      "INSERT INTO items (itemId, name, description, price, image) VALUES ($1, $2, $3, $4, $5);";
    await db.query(insertQuery, [
      value.itemId,
      value.name,
      value.description,
      value.price,
      value.image
    ]);

    // retrieve the newly added product
    const retrieveQuery = "SELECT * FROM items WHERE itemId = $1";
    const retrieveResult = await db.query(retrieveQuery, [value.itemId]);
    db.release();

    res.status(201).json({ items: retrieveResult.rows[0] }); // as a best practice, send the posted product as a response
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// PUT (update) a specific product
router.put("/items/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // check that the product exists
    const db = await pool.connect();
    const existsQuery =
      "SELECT EXISTS(SELECT itemId FROM items WHERE itemId = $1)";
    const existsResult = await db.query(existsQuery, [productId]);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .json({ errors: "The product with the given ID was not found." });

    // product exists; get it so that we can validate against it and send it as a response
    const retrieveQuery = "SELECT * FROM items WHERE itemId = $1";
    const retrieveResult = await db.query(retrieveQuery, [productId]);
    let product = retrieveResult.rows[0];

    const validationResult = validatePutProduct(product, req.body);
    const { value } = validationResult;
    const { error } = validationResult;
    // if there was an error with the validation, send an error
    if (error)
      return res.status(400).json({ errors: error.details[0].message });

    // if itemId is defined in body JSON
    if (req.body.hasOwnProperty("itemId")) {
      // if they want to change the itemId of the existing item to something else
      if (req.body.itemId != productId) {
        // check if itemId they want to use is already in use
        const existsQuery =
          "SELECT EXISTS(SELECT itemId FROM items WHERE itemId = $1)";
        const existsResult = await db.query(existsQuery, [req.body.itemId]);

        // if the itemId is already in use, send an error
        const productExists = existsResult.rows[0].exists;
        if (productExists)
          return res.status(409).json({
            errors:
              "There is already an item with that itemId. itemId must be unique."
          });
      }
    }

    // update the product in the database
    const updateQuery =
      "UPDATE items SET itemId = $1, name = $2, description = $3, price = $4, image = $5 WHERE itemId = $6";
    await db.query(updateQuery, [
      value.itemId,
      value.name,
      value.description,
      value.price,
      value.image,
      productId
    ]);

    product.itemId = value.itemId;
    product.name = value.name;
    product.description = value.description;
    product.price = value.price;
    product.image = value.image;
    db.release();

    res.status(200).json({ items: product }); // as a best practice, send the updated product as a response
  } catch (error) {
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

// DELETE a specific product
router.delete("/items/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // check that the product exists
    const db = await pool.connect();
    const existsQuery =
      "SELECT EXISTS(SELECT itemId FROM items WHERE itemId = $1)";
    const existsResult = await db.query(existsQuery, [productId]);

    // if the product does not exist, send an error
    const productExists = existsResult.rows[0].exists;
    if (!productExists)
      return res
        .status(404)
        .json({ errors: "The product with the given ID was not found." });

    // product exists; get it so that we can send it as a response
    const retrieveQuery = "SELECT * FROM items WHERE itemId = $1";
    const retrieveResult = await db.query(retrieveQuery, [productId]);
    const product = retrieveResult.rows[0];

    // delete the product from the database
    const deleteQuery = "DELETE FROM items WHERE itemId = $1";
    await db.query(deleteQuery, [productId]);
    db.release();

    res.status(200).json({ items: product }); // as a best practice, send the deleted product as a response
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
    const cartQuery =
      "SELECT cartitemid, itemid, name, description, price, image FROM cart INNER JOIN users ON cart.buyer=users.userid INNER JOIN items ON item=items.itemid WHERE buyer=$1;";
    const cart = await db.query(cartQuery, [userId]);
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
    const insertCartQuery =
      "INSERT INTO cart (cartItemId, buyer, item) VALUES ($1, $2, $3);";
    await db.query(insertCartQuery, [cartItemId, userId, itemId]);
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
    const deleteCartQuery = "DELETE from cart where cartitemid=$1;";
    await db.query(deleteCartQuery, [cartItemId]);

    db.release();
    return res.status(200);
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(403).json({ errors: "INVALID_TOKEN" });
    }
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

router.post("/cart/order", async (req, res) => {
  try {
    const { orders } = req.body;

    // Verify token
    const token = req.headers["authorization"];
    const userId = await verifyToken(token);

    // Add all orders
    const db = await pool.connect();
    for (const order in orders) {
      if (orders.hasOwnProperty(order)) {
        const orderItemId = orders[order].orderItemId;
        const itemId = orders[order].itemId;
        const date = orders[order].date;
        const insertOrderQuery =
          "INSERT INTO orders (orderItemId, buyer, item, dateOrdered) VALUES ($1, $2, $3, $4);";
        await db.query(insertOrderQuery, [orderItemId, userId, itemId, date]);
      }
    }

    // Delete cart data
    const deleteCartQuery = "DELETE FROM cart WHERE buyer=$1;";
    await db.query(deleteCartQuery, [userId]);

    db.release();
    return res.status(201).send("Cart Ordered");
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(403).json({ errors: "INVALID_TOKEN" });
    }
    return res.status(500).json({ errors: "INTERNAL_SERVER_ERROR" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    // Verify token
    const token = req.headers["authorization"];
    const userId = await verifyToken(token);

    // Get order history
    const db = await pool.connect();
    const orderHistoryQuery =
      "SELECT orderitemid, itemid, name, description, price, image, dateordered FROM orders INNER JOIN users ON orders.buyer=users.userid INNER JOIN items ON item=items.itemId WHERE buyer=$1 AND archived='f';";
    const orderHistory = await db.query(orderHistoryQuery, [userId]);
    const orderHistoryResults = orderHistory ? orderHistory.rows : null;

    db.release();
    return res.status(200).json({ orderHistory: orderHistoryResults });
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(403).json({ errors: "INVALID_TOKEN" });
    }
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
    itemId: Joi.string()
      .min(1) // minimum 1 character required
      .required(), // itemId is mandatory
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
        "https://images-na.ssl-images-amazon.com/images/I/51O-6mAvpwL._AC_SL1200_.jpg"
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
    itemId: Joi.string()
      .min(1) // minimum 1 character required
      .default(oldProduct.itemid), // if undefined, do not change the itemId
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
