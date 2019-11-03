CREATE TABLE users
(
    userID UUID NOT NULL,
    email VARCHAR(256) NOT NULL,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE items
(
    itemId VARCHAR(256) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(256) NOT NULL,
    price NUMERIC NOT NULL CONSTRAINT proper_price CHECK (price >= 0),
    image VARCHAR(512) NOT NULL,
);

CREATE TABLE cart
(
    cartItemId UUID NOT NULL,
    buyer UUID NOT NULL,
    item VARCHAR(256) NOT NULL,
    CONSTRAINT buyer_ref FOREIGN KEY (buyer) REFERENCES users(userID),
    CONSTRAINT item_ref FOREIGN KEY (item) REFERENCES items(itemId),
    PRIMARY KEY (cartItemId)
);

CREATE TABLE orders
(
    orderItemId UUID NOT NULL,
    buyer UUID NOT NULL,
    item VARCHAR(256) NOT NULL,
    dateOrdered DATE NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    CONSTRAINT buyer_ref FOREIGN KEY (buyer) REFERENCES users(userID),
    CONSTRAINT item_ref FOREIGN KEY (item) REFERENCES items(itemId),
    PRIMARY KEY (orderItemId)
);

CREATE TABLE resettokens
(
    userId UUID NOT NULL,
    email VARCHAR(256) NOT NULL,
    token VARCHAR(512) NOT NULL,
    PRIMARY KEY (userId, token)
);

SELECT * FROM orders NATURAL JOIN users INNER JOIN items ON item=items.itemId;

INSERT INTO users (userId, firstName, lastName, email, password)
VALUES ('d73a0001-3dea-4aa7-aca6-f9cdd8ec89af', 'Bob', 'Smith', 'test@gmail.com', 'password123');


INSERT INTO items (name, description, price, image)
VALUES ('Espresso', 'Espresso is generally thicker than coffee brewed by other methods, has a higher concentration of suspended and dissolved solids, and has a foam with a creamy consistency', 4.35, 'https://miro.medium.com/max/1200/1*4FzJWow3qJOV_O-3iKgBOw.jpeg');

INSERT INTO items (name, description, price, image)
VALUES ('Short Macchiato', 'An espresso coffee drink with a small amount of milk, usually foamed. In Italian, macchiato means "stained" or "spotted" so the literal translation of caffè macchiato is stained or marked coffee.', 4.70, 'https://coffeemakered.com/wp-content/uploads/2018/08/espresso-macchiato.jpg');

INSERT INTO items (name, description, price, image)
VALUES ('Creamy Iced Coffee', 'The perfect balance of milk, coffee, coldness, and whatever else', 5.00, 'https://www.joyfulhealthyeats.com/wp-content/uploads/2018/04/Sweet-Cream-Iced-Coffee-web-9.jpg');

INSERT INTO items (name, description, price, image)
VALUES ('Mocha', 'The best mocha in Victoria University', 4.00, 'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/03/mocha-001.jpg?itok=pX2cX4i_');

INSERT INTO items (name, description, price, image)
VALUES ('Long Black', 'Coffee Something Coffee Something Coffee', 3.50, 'https://whitehorsecoffee.com.au/wp-content/uploads/2016/09/unnamed-6-1170x780.jpg');

INSERT INTO items (name, description, price, image)
VALUES ('Iced Macchiato', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 3.50, 'https://tastykitchen.com/recipes/wp-content/uploads/sites/2/2010/05/icedcaramelmacchiato.jpg');
