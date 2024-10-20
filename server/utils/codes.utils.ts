interface ErrorResponse {
  status: number;
  message: string;
}

interface SuccessResponse {
  status: number;
  message: string;
}

const messages = {
  errors: {
    insufficientData: "Insufficient data.",
    userNotFound: "User not found.",
    invalidCredentials: "Invalid email or password.",
    userExists: "User already exists.",
    internalServerError: "Internal server error.",
  },
  successes: {
    userCreated: "User created successfully.",
    requestSuccessful: "Request successful.",
  },
};

const handleErrors = (code: number): ErrorResponse => {
  switch (code) {
    case 400:
      return {
        status: 400,
        message: messages.errors.insufficientData,
      };
    case 404:
      return {
        status: 404,
        message: messages.errors.userNotFound,
      };
    case 401:
      return {
        status: 401,
        message: messages.errors.invalidCredentials,
      };
    case 409:
      return {
        status: 409,
        message: messages.errors.userExists,
      };
    default:
      return {
        status: 500,
        message: messages.errors.internalServerError,
      };
  }
};

const handleSuccess = (code: number): SuccessResponse => {
  switch (code) {
    case 201:
      return {
        status: 201,
        message: messages.successes.userCreated,
      };
    default:
      return {
        status: 200,
        message: messages.successes.requestSuccessful,
      };
  }
};

export { handleErrors, handleSuccess };
