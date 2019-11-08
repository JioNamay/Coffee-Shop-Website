# NWEN304 Group Project

### Members: Duane Alcala, Benjamin Rhodes, Raphael Namay

#### a) How to use our system

Our system is a coffee shop. To visit the coffee shop, visit https://aroma-coffee-nwen304.herokuapp.com.<br><br>To browse the list of products, click "Shop" near the top-right corner. Scroll to view more products, or use the search bar directly above the list of products to search for specific products.<br><br>To add items to your cart and place an order, you must log in. To log in, click "Login" near the top-right corner and enter your email and password if you already have an account on the site. Alternatively, click the blue "Log In With Google" button to sign in via Google. If you do not already have an account and wish to create one, click "Sign Up" near the top-right corner, and submit the sign-up form.<br><br>After logging in, browse the list of products and click "Add To Cart" to add that item to your cart. If you would like to review your cart or purchase the items in your cart, click "Cart" near the top-right corner. When viewing your cart, click the black "Order Items" button to order everything in your cart. Your cart will then be cleared and everything you ordered will be added to your order history.<br><br>To view your order history, click "Order History" near the top-right corner.<br><br>To log out, click "Log Out" in the top-right corner.

#### b) The REST interface

GET /api/shop/items - gets the list of products in the database

GET /api/shop/items/{id} - gets the product with the specified ID (product IDs are unique)

POST /api/shop/items - adds a new product to the database

PUT /api/shop/items/{id} - updates an existing product with the specified ID

DELETE /api/shop/items/{id} - deletes an existing product with the specified ID

GET /api/shop/cart - gets the items in the cart of the logged in user

POST /api/shop/cart - adds an item to the cart of the logged in user

DELETE /api/shop/cart/{cart_item_id} - deletes a specified item from the cart of the logged in user

POST /cart/order - adds the contents of the cart to the logged in user's order history

GET /orders - gets the logged in user's order history

POST /login - logs in an admin account

GET /users - gets every user's account information, excluding their passwords

GET /users/{userId} - gets the account information (excluding password) of the user with the specified ID

DELETE /order/{orderId} - deletes the order with the specified order ID

POST /signup - creates a new user account

POST /login - logs in a user account

GET /google - used for Google OAuth authentication

GET /google/redirect - used for Google OAuth authentication

POST /tokenlogin - automatically logs a user in if the provided token is valid, so they don't have to enter their login credentials every time (similar to cookies; token is valid for 5 hours from assignment)

POST /identify - sends a one-time token (valid for 1 hour) to a user's email address if they indicate that they have forgotten their password. Logging in using this token instead of their forgotten password will allow the user to reset their password

POST /passwordreset - resets the user's password. Requires a valid token from POST/tokenlogin

#### c) What error handling has been implemented
