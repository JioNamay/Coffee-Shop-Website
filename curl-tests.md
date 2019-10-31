# cURL Test Cases

## GET /api/products

|                                      Command                                       |                              Result on CLI                               |
| :--------------------------------------------------------------------------------: | :----------------------------------------------------------------------: |
| curl -H "Content-Type: application/json" -X GET http://localhost:5000/api/products | An array containing JSON objects of the all the products in the database |

## GET /api/products/{id}

|                      Assumption                       |                                       Command                                        |                             Result on CLI                             |
| :---------------------------------------------------: | :----------------------------------------------------------------------------------: | :-------------------------------------------------------------------: |
|   A product with an ID of 1 exists in the database    | curl -H "Content-Type: application/json" -X GET http://localhost:5000/api/products/1 |              A JSON object of the product with the ID 1               |
| A task with an ID of 1 DOES NOT exist in the database | curl -H "Content-Type: application/json" -X GET http://localhost:5000/api/products/1 | The following message: "The product with the given ID was not found." |
