CREATE DATABASE storeDB;
USE storeDB;

-- create the products table
CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    price DECIMAL NOT NULL,
    stock INTEGER NOT NULL,
    description VARCHAR (255)
);

-- put a few coffee products in the products table
INSERT INTO products (name, price, stock, description)
VALUES
('Arabica', 20.99, 50, 'Smooth, aromatic, and delicious. Low caffeine.'),
('Liberica', 34.50, 75, 'Low yield compared to Arabica and Robusta.'),
('Robusta', 18.99, 40, 'Strong. 83% more caffeine than Arabica.');