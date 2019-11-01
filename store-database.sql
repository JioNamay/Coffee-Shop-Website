CREATE DATABASE storeDB;
USE storeDB;

-- create the products table
CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    price DECIMAL NOT NULL,
    stock INTEGER NOT NULL
);

-- put a few coffee products in the products table
INSERT INTO products (name, price, stock)
VALUES
('Arabica', 20.99, 50),
('Liberica', 34.50, 75),
('Robusta', 18.99, 40);