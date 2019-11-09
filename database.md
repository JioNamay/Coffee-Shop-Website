### Database Design

**Users**<br>
The database needed a user table to keep track of the registered users. Each user needs a unique
primary key; that's why a UUID is used as a primary key for the users table so they can be uniquely identified.
The schema should obviously hold their email, first name, etc...

**Administrators**<br>
The admin table is separate from the user table because they hold different data so it was fitting to separate them.

**Items**<br>
Products that are being sold need to be in their own table and hold specific information that is only fitting to the
item so that no partial dependencies are made which prevents any update anomalies. This schema should hold
information belonging to a product only such as the name, description, price, image and their ID which needs to be unique.

**Cart**<br>
Cart is a schema that allows users and items to be related with each other. In order to do this, the table
needs a foreign key for the user (buyer) and uses the foreign key for the item ID (item). This way, whenever
the user looks at their cart, the database can join the user and items table through the foreign keys and
give all of the items that a user has added to their cart.

Each cart item also needs its own ID because a user should be able to order more than specific item for each cart.

**Orders**<br>
Orders is a schema that allows users to be related with the items that they have ordered. This should only
hold information related to an order. Foreign keys are used to relate the users and items table together.
It also holds additional fields like the date an item was ordered so that the user has extra information
when it is displayed to the website.

It holds an archived field so that it cannot be displayed to the user if an admin has archived it.

**ResetTokens**<br>
The table is here to track the reset tokens of a user. If the user hasn't claimed their reset token and they ask
for another one, the token field of this table will be updated and assigned to the appropriate user.

This is so that past reset tokens are made invalid once a new reset request is made.

<br>

**Final Points** <br>
Overall, each table is designed so that it only holds information that is directly related to it and it should
contain the necessary information to fully describe the relation. For example, the items table holds ID and everything
related to an item only; it's not split into two tables with itemID and name, and then another table with price, image, etc.

Tables also need to be created so that data is separated correctly to prevent update anomalies. Here, a cart table is necessary
so that it can relate the users and items through their foreign keys. It's bad practice to have a cart schema where it copies
the fields of users and then copies the fields of items.

No DELETE/UPDATE cascading is used on purpose. It's hard to track down which child rows are affected. It's
better for the user to manually do deletes or updates and be aware of it.
