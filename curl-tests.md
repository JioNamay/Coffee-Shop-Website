# cURL Test Cases

## GET /api/shop

|                                              Command                                               |                            Result on CLI                             |
| :------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------: |
| curl -H "Content-Type: application/json" -X GET http://aroma-coffee-nwen304.herokuapp.com/api/shop | An array containing JSON objects of all the products in the database |

## GET /api/shop/{id}

|                        Assumption                        |                                               Command                                                |                             Result on CLI                             |
| :------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------: |
|     A product with an ID of 1 exists in the database     | curl -H "Content-Type: application/json" -X GET http://aroma-coffee-nwen304.herokuapp.com/api/shop/1 |              A JSON object of the product with the ID 1               |
| A product with an ID of 1 DOES NOT exist in the database | curl -H "Content-Type: application/json" -X GET http://aroma-coffee-nwen304.herokuapp.com/api/shop/1 | The following message: "The product with the given ID was not found." |
