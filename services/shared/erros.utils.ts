export const errors = {
  U401: {
    status: 400,
    errorCode: 'U401',
    errorDescription:
      'Please provide all necessary fields. Required fields: email, password.',
  },
  U402: {
    status: 400,
    errorCode: 'U402',
    errorDescription: 'Incorrect Password.',
  },
  U404: {
    status: 400,
    errorCode: 'U404',
    errorDescription: 'Error retrieving user.',
  },
  U405: {
    status: 404,
    errorCode: 'U405',
    errorDescription: 'No user was found for current filters.',
  },
  U406: {
    status: 400,
    errorCode: 'U406',
    errorDescription: 'Please provide User ID. User ID parameter is missing.',
  },
  U407: {
    status: 400,
    errorCode: 'U407',
    errorDescription: 'Unknown user type.',
  },
  U408: {
    status: 400,
    errorCode: 'U408',
    errorDescription:
      "Please provide all necessary fields. Fields missing: 'role'.",
  },
  U409: {
    status: 400,
    errorCode: 'U409',
    errorDescription:
      'Please provide all necessary fields. Required fields: username, firstName, lastName.',
  },
  U411: {
    status: 400,
    errorCode: 'U411',
    errorDescription: 'Authorization Token is missing.',
  },
  U412: {
    status: 400,
    errorCode: 'U412',
    errorDescription:
      'Unauthorized User. User is not an admin or the owner of the account.',
  },
  U414: {
    status: 404,
    errorCode: 'U414',
    errorDescription: 'Unauthorized user.',
  },
  U415: {
    status: 400,
    errorCode: 'U415',
    errorDescription:
        'The email provided is the same as the one used for this account.',
  },
  U501: {
    status: 500,
    errorCode: 'U501',
    errorDescription: "Unable to update the user's data.",
  },
  U502: {
    status: 400,
    errorCode: 'U502',
    errorDescription: 'Error updating User.',
  },
  C401: {
    status: 400,
    errorCode: 'C401',
    errorDescription:
      'Please provide all necessary fields. Required fields: username, firstName, lastName, email, password, addresses, phoneNumber.',
  },
  C403: {
    status: 400,
    errorCode: 'C403',
    errorDescription: 'Invalid email address.',
  },
  C404: {
    status: 400,
    errorCode: 'C404',
    errorDescription: 'Duplicate key error (either email or username).',
  },
  C405: {
    status: 404,
    errorCode: 'C405',
    errorDescription: 'Unable to retrieve Customers.',
  },
  C406: {
    status: 404,
    errorCode: 'C406',
    errorDescription: 'Unable to retrieve Customer.',
  },
  C408: {
    status: 400,
    errorCode: 'C408',
    errorDescription:
      'Please provide all necessary fields. Required fields: isVerified.',
  },
  C409: {
    status: 400,
    errorCode: 'C409',
    errorDescription:
      'Please provide all necessary fields. Required fields: isDeactivated.',
  },
  C410: {
    status: 400,
    errorCode: 'C410',
    errorDescription:
      'Invalid format for cardNumber. Must be a 16-digit number.',
  },
  C411: {
    status: 400,
    errorCode: 'C411',
    errorDescription:
      'Invalid format for cardHolder. Must contain only letters and spaces.',
  },
  C412: {
    status: 400,
    errorCode: 'C412',
    errorDescription: 'Invalid format for cvc. Must be a 3-digit number.',
  },
  C413: {
    status: 400,
    errorCode: 'C413',
    errorDescription:
      'Please provide all necessary fields. Required fields: address.',
  },
  C414: {
    status: 400,
    errorCode: 'C414',
    errorDescription:
      'Invalid format for street. Must contain only letters and spaces.',
  },
  C415: {
    status: 400,
    errorCode: 'C415',
    errorDescription:
      'Invalid format for streetNumber. Must contain only letters, numbers, and spaces.',
  },
  C416: {
    status: 400,
    errorCode: 'C416',
    errorDescription: 'Invalid format for zipCode. Must be a 5-digit number.',
  },
  C417: {
    status: 400,
    errorCode: 'C417',
    errorDescription:
      'Invalid format for city. Must contain only letters and spaces.',
  },
  C418: {
    status: 400,
    errorCode: 'C418',
    errorDescription:
        'Invalid format for bellName. Must contain only letters and spaces.',
  },
  C419: {
    status: 400,
    errorCode: 'C419',
    errorDescription: 'Please provide all necessary fields. Required fields: paymentInfo.',
  },
  C420: {
    status: 400,
    errorCode: 'C420',
    errorDescription: 'Please provide all necessary fields. Required fields: cardNumber, cardHolder, cvc.',
  },
  C421: {
    status: 400,
    errorCode: 'C420',
    errorDescription: 'Invalid format for fullAddress. Must contain only letters and spaces.',
  },
  C422: {
    status: 400,
    errorCode: 'C422',
    errorDescription: 'Please provide all necessary fields. Required fields: phoneNumber.',
  },
  C501: {
    status: 400,
    errorCode: 'C501',
    errorDescription: 'Error saving new User.',
  },
  C502: {
    status: 500,
    errorCode: 'C502',
    errorDescription: 'Error updating Customer.',
  },
  A401: {
    status: 400,
    errorCode: 'A401',
    errorDescription:
      'Please provide all necessary fields. Required fields: username, firstName, lastName, email, password, role.',
  },
  A403: {
    status: 400,
    errorCode: 'A403',
    errorDescription: 'Invalid email address.',
  },
  A404: {
    status: 400,
    errorCode: 'A404',
    errorDescription: 'Duplicate key error (either email or username).',
  },
  A405: {
    status: 400,
    errorCode: 'A405',
    errorDescription:
      "Invalid role provided. Available roles: 'admin' or 'owner'.",
  },
  A406: {
    status: 404,
    errorCode: 'A406',
    errorDescription: 'Unable to retrieve Admins.',
  },
  A407: {
    status: 404,
    errorCode: 'A407',
    errorDescription: 'Unable to retrieve Admin.',
  },
  A502: {
    status: 500,
    errorCode: 'A502',
    errorDescription: 'Error updating Admin.',
  },
  A409: {
    status: 400,
    errorCode: 'A409',
    errorDescription:
      'Please provide all necessary fields. Required fields: role.',
  },
  A410: {
    status: 400,
    errorCode: 'A410',
    errorDescription: 'Unauthorized User. User does not have admin role.',
  },
  A501: {
    status: 400,
    errorCode: 'A501',
    errorDescription: 'Error saving new Admin.',
  },
  CA401: {
    status: 400,
    errorCode: 'CA401',
    errorDescription:
        'Please provide all necessary fields. Required fields: title.',
  },
  CA404: {
    status: 404,
    errorCode: 'CA404',
    errorDescription: 'Error retrieving Category.',
  },
  CA501: {
    status: 500,
    errorCode: 'CA501',
    errorDescription: 'Error saving new Category.',
  },
  CA502: {
    status: 500,
    errorCode: 'CA502',
    errorDescription: 'Error updating Category.',
  },
  P401: {
    status: 400,
    errorCode: 'P401',
    errorDescription: 'Please provide all necessary fields. Required fields: category, title, description, ingredients, price, image.',
  },
  P402: {
    status: 400,
    errorCode: 'P402',
    errorDescription: 'Please provide all necessary fields. Required fields: category.',
  },
  P403: {
    status: 400,
    errorCode: 'P403',
    errorDescription: 'Please provide all necessary fields. Required fields: ingredients.',
  },
  P404: {
    status: 404,
    errorCode: 'P404',
    errorDescription: 'Error retrieving Product.',
  },
  P501: {
    status: 500,
    errorCode: 'P501',
    errorDescription: 'Error saving Product.',
  },
  P502: {
    status: 500,
    errorCode: 'P502',
    errorDescription: 'Error updating Product.',
  },
  O401: {
    status: 400,
    errorCode: 'O401',
    errorDescription: 'Please provide all necessary fields. Required fields: products, address, totalPrice, paymentWay.',
  },
  O402: {
    status: 400,
    errorCode: 'O402',
    errorDescription: 'Please provide all necessary fields. Required fields: products, status, timeReceived, timeCompleted, address, totalPrice, estimatedTime, paymentWay.',
  },

  O403: {
    status: 400,
    errorCode: 'O403',
    errorDescription: 'Please provide all necessary fields. Required fields: estimatedTime.',
  },
  O404: {
    status: 404,
    errorCode: 'O404',
    errorDescription: 'Error retrieving Order.',
  },
  O501: {
    status: 501,
    errorCode: 'O501',
    errorDescription: 'Error saving new Order.',
  },
  O502: {
    status: 502,
    errorCode: 'O502',
    errorDescription: 'Error updating Order.',
  },
};
