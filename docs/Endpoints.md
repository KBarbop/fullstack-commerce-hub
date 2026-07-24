# API ENDPOINTS

### User Endpoints

- POST _**/log-in**_

  Log in user and return authentication token

  payload:
    ````
    {
        email: string,
        password: string
    }
    ````
  response:

    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            user: ICustomer | IAdmin
        }
    }
  
    cookies: commerce_hub_token
    ````

- POST _**/log-out**_

  Log out user and clear authorization token

  payload:
    ````
    headers:
      Authorization: Bearer {token}
    ````
  
  response:

    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            message: "Logged out successfully."
        }
    }
    ````

- GET _**/get-user/:userId**_

  Get user based on user's ID

  response:

    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            user: User || Admin || Customer
        }
    }
    ````

- GET _**/get-users**_

  Get all users

  response:

    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            users: User[],
        }
    }
    ````

- POST _**/get-users-by-type/**_

  Get user based on user's type

  payload:
  ````
  {
      role: string< 'owner' || 'admin' || 'customer' >,
  }
  ````

  response:

    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            users: Admin[] || Customer[],
        }
    }
    ( in case the role is either 'owner' or 'admin' the users retrieved will be of the Admin document type but will be 
    retrieved based on their role. )
    ````



- PATCH _**/edit-user-data/:userId**_

  Edit a user's basic data

  payload:    
    ````
  {
      username: string,
      firstName: string,
      lastName: string,
  }
  (all fields are required. In case any of the fields remains unchanged, then it should be passed in the body as is.)
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            user: IUser
        },
    }
    ````

- PATCH _**/update-user-email/:userId**_

  Update a user's email.

  payload:
    ````
  {
      oldEmail: string,
      newEmail: string,
      password: string,
  }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedUser: IUser || ICustomer,
        },
    }
    ````
  
- DELETE _**/delete-user/:userId**_

  Delete a user based on the user's ID

  response:
  ````
  {
      responseStatus: "successfull",
      statusCode: 200,
      data: {
          "message": "Customer was deleted successfully.."
      }
  }
  ````
### Admin Endpoints

- POST _**/sign-up**_

  Create a new Admin

  payload:
    ````
    {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: string< 'owner' || 'admin'>,
    }
    ````

  response:

    ````
    { 
      "responseStatus": "successfull",
      "statusCode": 200,
      "data": {
          "admin": IAdmin,
      }
    }
    ````

- PATCH _**/update-admin-role/:userId**_

  Update the role of an Admin. Only an admin with the role of 'admin' is able to call that.

  payload:
    ````
    {
        role: string< 'owner' || 'admin' >,
    }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedAdmin: IAdmin
        }
    }
    ````
  
### Customer Endpoints

- POST _**/sign-up**_

  Create a new Customer

  payload:
    ````
    {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phoneNumber: string,
        address: IAddress,
    }
    ````

  response:

    ````
    { 
      "responseStatus": "successfull",
      "statusCode": 200,
      "data": {
          "customer": ICustomer,
      }
    }
    ````

- PATCH _**/update-verification-status/:userId**_

  Update the verify field of a Customer. This can be called only through an authenticated link or by an admin.

  payload:    
    ````
    {
        isVerified: boolean,
    }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedUser: ICustomer
        }
    }
    ````

- PATCH _**/update-payment-info/:customerId**_

  Update the payment info of a Customer. This can be called only by the account owner or by an admin. The account owner will be verified through the user's token.

  payload:
    ````
    {
        paymentInfo: IPaymentInfo,
    }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedUser: ICustomer
        }
    }
    ````

- PATCH _**/update-address/:customerId**_

  Update the address of a Customer. This can be called only by the account owner or by an admin. The account owner will be verified through the user's token.

  payload:
    ````
    {
        address: IAddress,
    }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedUser: ICustomer
        }
    }
    ````

- PATCH _**/update-active-status/:customerId**_

  Update the active status of a Customer. This can be called only by the account owner or by an admin. The account owner will be verified through the user's token.

  payload:
    ````
    {
        isDeactivated: boolean,
    }
    ````

  response:
    ````
    {
        responseStatus: "successfull",
        statusCode: 200,
        data: {
            updatedUser: ICustomer
        }
    }
    ````

### Orders Endpoints

- GET _**/get-orders**_

  Get all orders

  response:

    ````
    {
        orders: Order[],
    }
    ````

- GET _**/get-order/:orderId**_

  Get order based on order's ID

  response:

    ````
    {
        order: Order,
    }
    ````
- POST _**/create-order**_

  Create a new Order. Only verified customers should be able to order.

  payload:
  ````
    {
        products: [
            {
                product: string,
                quantity: number,
                price: number,
                comment: string, 
            }
        ],
        totalPrice: number,
        address: Address,
    }
  ````

  response:
  ````
    {
        order: Order,
    }
  ````
  
- PATCH _**/confirm-order**_

  After an order has been received, confirm the order and set estimated time of delivery

  payload:
  ````
    {
        orderId: string,
        estimatedTime: number,
    }
  ````

  response:
  ````
    {
        order: Order,
    }
  ````

- PATCH _**/complete-order**_

  After an order has been processed, mark the status as complete

  payload:
  ````
    {
        orderId: string,
    }
  ````

  response:
  ````
    {
        order: Order,
    }
  ````
- DELETE _**/delete-order/:orderId**_

  Delete an order based on the order's ID

  response:
  ````
    Successfull Request
  ````

### Products Endpoints

- GET _**/get-products**_

  Get all products

  response:

    ````
    {
        products: Product[],
    }
    ````

- GET _**/get-product/:productId**_

  Get product based on product's ID

  response:

    ````
    {
        product: Product,
    }
    ````
- GET _**/get-product-by-category/:categoryId**_

  Get all products based on category's ID

  response:

    ````
    {
        products: Product[],
    }
    ````

- POST _**/create-product**_

  Create a new Product

  payload:
  ````
    {
        title: string,
        description: string,
        ingidients: string[],
        price: number,
        image?: string,
        category: string,
    }
  ````

  response:
  ````
    {
        product: Product,
    }
  ````

- PATCH _**/edit-product/:productId**_

  Edit a product's basic data

  payload:
  ````
    {
        title?: string,
        description?: string,
        ingidients?: string[],
        price?: number,
        image?: string,
        category?: string,
    }
  ````

  response:
  ````
    {
        order: Order,
    }
  ````

- DELETE _**/delete-product/:productId**_

  Delete a product based on the product's ID

  response:
  ````
    Successfull Request
  ````

### Categories Endpoints

- GET _**/get-categories**_

  Get all categories

  response:

    ````
    {
        categories: Category[],
    }
    ````

- GET _**/get-category/:categoryId**_

  Get category based on category's ID

  response:

    ````
    {
        category: Category,
    }
    ````
- POST _**/create-category**_

  Create a new Category

  payload:
  ````
    {
        title: string,
        description: string,
        image?: string
    }
  ````

  response:
  ````
    {
        category: Category,
    }
  ````

- PATCH _**/edit-category/:categoryId**_

  Edit a category's basic data

  payload:
  ````
    {
        title?: string,
        description?: string,
        image?: string,
    }
  ````

  response:
  ````
    {
        category: Category,
    }
  ````

- DELETE _**/delete-category/:categoryId**_

  Delete a category based on the category's ID. Delete all products inside the category as well.

  response:
  ````
    Successfull Request
  ````