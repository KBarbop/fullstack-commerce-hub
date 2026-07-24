# Possible Error Codes

### User Endpoints Errors

- U401: Please provide all necessary fields. Required fields: email, password.
- U402: No User was found with given email.
- U4O3: Incorrect Password.
- U404: Error retrieving user.
- U405: No user was found for current filters.
- U406: Please provide User ID. User ID parameter is missing.
- U407: Unknown user type.
- U408: Please provide all necessary fields. Fields missing: 'role'.
- U409: Please provide all necessary fields. Required fields: username, firstName, lastName.
- U411: Authorization Token is missing.
- U412: Unauthorized User. User is not an admin or the owner of the account.
- U413: Unauthorized User. User is not an admin.
- U415: The email provided is the same as the one used for this account.
- U501: Unable to update the user's data.
- U502: Error updating User.

### Customer Endpoints Errors

- C401: Please provide all necessary fields. Required fields: username, firstName, lastName, email, password, address, phoneNumber.
- C403: Invalid email address.
- C404: Duplicate key error (either email or username).
- C405: Unable to retrieve Customers.
- C406: Unable to retrieve Customer.
- C408: Please provide all necessary fields. Required fields: isVerified.
- C409: Please provide all necessary fields. Required fields: isDeactivated.
- C410: Invalid format for cardNumber. Must be a 16-digit number.
- C411: Invalid format for cardHolder. Must contain only letters and spaces.
- C412: Invalid format for cvc. Must be a 3-digit number.
- C413: Please provide all necessary fields. Required fields: address.
- C414: Invalid format for street. Must contain only letters and spaces.
- C415: Invalid format for streetNumber. Must contain only letters, numbers, and spaces.
- C416: Invalid format for zipCode. Must be a 5-digit number.
- C417: Invalid format for city. Must contain only letters and spaces.
- C418: Invalid format for bellName. Must contain only letters and spaces.
- C501: Error saving new User.
- C502: Error updating Customer.

### Admin Endpoints Errors

- A401: Please provide all necessary fields. Required fields: username, firstName, lastName, email, password, role.
- A403: Invalid email address.
- A404: Duplicate key error (either email or username).
- A405: Invalid role provided. Available roles: 'admin' or 'owner'.
- A406: Unable to retrieve Admins.
- A407: Unable to retrieve Admin.
- A409: Please provide all necessary fields. Required fields: role.
- A410: Unauthorized User. User does not have admin role.
- A501: Error saving new Admin.
- A502: Error updating Admin.

### Category Endpoints Errors

- CA401: Please provide all necessary fields. Required fields: title, description, image.
- CA404: Error retrieving Category.
- CA501: Error saving new Category.
- CA502: Error updating Category.

### Product Endpoints Errors

- P401: Please provide all necessary fields. Required fields: category, title, description, ingredients, price, image.
- P402: Please provide all necessary fields. Required fields: category.
- P403: Please provide all necessary fields. Required fields: ingredients.
- P404: Error retrieving Product.
- P501: Error saving new Product.
- P502: Error updating Product.
