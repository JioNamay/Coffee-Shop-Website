# NWEN304 Group Project

### Members: Duane Alcala, Benjamin Rhodes, Raphael Namay

#### How To Use The System

**Local Use**: <br>
To use the system on a local device, go to the source folder and run "npm install" and then go to the
client folder and run "npm install". Once the packages have been installed, set up the SQL inside
the schemas/tables.sql file.

You would also need to set up OAuth if you want to test it out locally.

Then you need a secrets file with these details: 

secrets = { <br>
  database: 'YOUR DATABASE HERE', <br>
  tokenKey: 'JWT TOKEN SECRET', <br>
  emailRecovery: 'GOOGLE ACCOUNT EMAIL (FOR PASSWORD RESET EMAIL)', <br>
  passwordRecovery: 'GOOGLE ACCOUNT PASSWORD (FOR PASSWORD RESET EMAIL)', <br>
  resetUrl: 'localhost:3000', <br>
  clientID: 'CLIENT ID FOR OAUTH', <br>
  clientSecret: 'CLIENT SECRET FOR OAUTH', <br>
  absoluteURI: 'http://localhost:3000' <br>
}; <br>

module.exports = secrets;

**Heroku Use**: <br>
To use the system on heroku, go to https://aroma-coffee-nwen304.herokuapp.com/ <br>
When you first open the system, you will be greeted with the home page. The top will contain a navigation bar.

**Shop** <br>
The shopping page is a page where you can browse through all of the items that are available. The user can then
use the search bar up top to filter out the items. In order to be able to add items to a cart a user needs to
log in.

**Login** <br>
This is where the user can log in. They have a choice on what login method they can use. The user can log in through Google
or they can use the email that they signed up with if it's available.

NOTE: If you haven't logged out officially using "Logout" in the navigation bar, the "Login" option will automatically
sign you in assuming you have a legitimate token in your local storage that hasn't expires yet. If the token
is no longer valid, you have to sign in again.


**Signup** <br>
A user can sign up and create an account through this page.

**Password Reset** <br>
If you want to reset your password, go to the "Login" page, click forgot your password and then supply the email
that is attached to the forgotten password. You will then get an email containing a reset link. Once you click
this link, you are redirected to a page where you can reset your password. This token only lasts once and if you use
the link again after resetting, the token will be invalid.

**Cart** <br>
If a user is logged in and has ordered items, they will be able to see a "Cart" option at the navigation bar.
Once they click on this option, they can view the items that they have ordered. In order to get rid of items
from the cart, there is a "x" button at the right side of each item (if you can't see this button, zoom out because
your resolution is too low.)

If you want to delete items on the heroku side, do it a little bit slowly one by one because heroku is guaranteed
to be slower (because this site is free) so the database will not update as quickly.


**Order History** <br>
Once the user has pressed "Order Items" on the Cart page, they will appear on this page. This page
shows all of the user's past orders.

**Admin** <br>
There is no link to the admin page on purpose. In order to access it, go to /admin/login and then
type in a username of "admin" and password of "admin". Once you are there, you will be redirected to the admin
page which lists the users. You can then view their order history by clicking on "View Order History" for
each specific user.

**Timeout Function** <br>
Once the user has logged in they are given a set session that they can use. That session time is 
3 hours so they have plenty of time to shop. Once the 3 hour session is over, they have to log in
again in order to continue their activities. This prevents malicious users from using their computer.


#### What The REST Interface Is

**GET /api/shop/items** <br>
Description: Gets the list of products that are available. <br>

Response Codes: <br>
200: Successful request <br>
500: Internal server error <br>

<br>

**GET /api/shop/items/{id}** <br>
Description: Gets the product with the specified ID (product IDs are unique) <br>

Response Codes: <br>
200: Successful request <br>
404: Product not found <br>
500: Internal server error <br>

<br>

**POST /api/shop/items** <br>
Description: Adds a new product to the database <br>

Response Codes: <br>
201: Item created <br>
400: Errors with body (eg. empty name) <br>
403: Forbidden <br>
409: Item ID already exists <br>
500: Internal server error <br>

<br>

**PUT /api/shop/items/{id}** <br>
Description: Updates an existing product with the specified ID <br>

Response Codes: <br>
200: Product updated <br>
400: Errors with supplied edit (eg. empty name) <br>
404: Product ID not found <br>
409: Item ID already exists (if item ID edit is supplied) <br>
500: Internal server error

<br>


**DELETE /api/shop/items/{id}** <br>
Description: Deletes an existing product with the specified ID <br>

Response Codes: <br>
200: Successful delete <br>
403: Forbidden <br>
404: No such product with item ID <br>
500: Internal server error <br>

<br>

**GET /api/shop/cart** <br>
Description: Gets the items in the cart of the logged in user <br>

Response Codes: <br>
200: Successful retrieval of cart <br>
403: Token is invalid or has expired <br>
500: Internal server error <br>

<br>

**POST /api/shop/cart** <br> 
Description: Adds an item to the cart of the logged in user <br>

Response Codes: <br>
201: Item added to cart <br>
403: Token is invalid or has expired <br>
500: Internal server error <br>

<br>

**DELETE /api/shop/cart/{cart_item_id}** <br>
Description: Deletes a specified item from the cart of the logged in user <br>

Response Codes: <br>
200: Item successfully deleted from cart <br>
403: Token is invalid or has expired <br>
500: Internal server error <br>

<br>

**POST api/shop/cart/order** <br>
Description: Adds the contents of the cart to the logged in user's order history <br>

Response Codes: <br>
200: Items added to order history <br>
403: Token is invalid or has expired <br>
500: Internal server error <br> 

<br>

**GET api/shop/orders** <br>
Description: Gets the logged in user's order history <br>

Response Codes: <br>
200: Items from order history retrieved <br>
403: Token is invalid or has expired <br>
500: Internal server error <br> 

<br>

**POST api/admin/login** <br>
Description: Logs in an admin account <br>

Response Codes: <br>
200: Successful login, returns adminId and username through JSON <br>
400: Errors with login body (empty username and/or password) <br>
500: Internal server error <br>

<br>

**GET api/admin/users** <br>
Description: Gets every user's account information, excluding their passwords <br>

Response Codes: <br>

**GET api/admin/users/{userId}** <br>
Description: Gets the account information (excluding password) of the user with the specified ID <br>

Response Codes: <br>
200: Successfully gets users, passes info through JSON <br>
401: Unauthorized action <br>
500: Internal server error <br>

<br>

**DELETE api/admin/order/{orderId}** <br>
Description: Deletes the order with the specified order ID <br>

Response Codes: <br>
200: Order successfully deleted <br>
401: Unauthorized action <br>
404: No such order with specified order ID <br>
500: Internal server error <br>

<br>

**POST api/user/signup** <br>
Description: Creates a new user account

Response Codes: <br>
201: User created <br>
400: Errors with given body (eg. name is empty) or email already exists <br>
500: Internal server error <br>

<br>

**POST api/user/login** <br>
Description: Logs in a user account <br>

Response Codes:
200: User successfully logged in. Returns token <br>
400: Errors with given body (eg. password is empty) <br>
500: Internal server error <br>

<br>

**GET api/user/google** <br>
Description: Redirects the user to log in through their Google account. <br>

<br>

**GET api/user/google/redirect** <br>
Description: Once the user has logged in through Google OAuth, they are redirected to this endpoint and back
to the application's site. <br>

Response Codes: <br>
500: Internal server error <br>

<br>

**POST api/user/tokenlogin** <br>
Description: Automatically logs a user in if the provided token is valid, so they don't have to enter their login credentials every time (similar to cookies; token is valid for 3 hours from assignment) <br>

Response Codes: <br>
200: Successful login using token <br>
403: Token is invalid or expired <br>
500: Internal server error <br>

<br>

**POST api/user/identify** <br>
Description: Sends a one-time token (valid for 1 hour) to a user's email address if they indicate that they have forgotten their password. Logging in using this token instead of their forgotten password will allow the user to reset their password <br>

Response Codes: <br>
200: Email with reset token successfully sent <br>
500: Internal server error

<br>

**POST api/user/passwordreset** <br>
Description: Resets the user's password. Requires a valid token from POST/tokenlogin <br>

Response Codes: <br>
200: Successful password reset <br>
403: Token is invalid, has already been used, or has expired <br>
500: Internal server error


#### What Error Handling Has Been Implemented

**SQL Injection and Cross-site Scripting Vulnerability Mitigation** <br>

To mitigate the risk of SQL injection attacks, we took advantage of PostgreSQL's parameterized query support instead of using string contatenation. To mitigate the risk of cross-site scripting attacks, ReactJS was used, wherein string variables in views are automatically escaped.

**Signup/Login Forms** <br>

The forms in the front end already have protection where if some fields are empty or invalid, then they cannot
submit the form. However, if a malicious user tried to bypass the frontend, protection on the backend is also
available. The API routes will send back a 400 status code if some elements of the request body are empty or 
are invalid. 

**Invalid Authorization** <br>

A lot of the endpoints are actually authorization protected using a token. A malicious user would not be able
to get information such as another user's cart information unless they managed to successfully guess the token
or get it through some other way. If a token is invalid, they cannot continue with the request.

This does mean that the user would need to log in again once their token expires but that's OK because this is a part
of the timeout functionality (token expiry after session goes past given time).

**POST/PUT Request Body Validation** <br>

Validation of POST/PUT request bodies was conducted using the express-validator package or the @hapi/joi package. These packages were used to ensure that POST/PUT request bodies contained certain mandatory keys and that their values were of the correct type and length. Additionally, these packages ensured that keys that were not mandatory were assigned default values. If any of these requirements were not met by the request body, the appropriate status code and an error message were sent.


