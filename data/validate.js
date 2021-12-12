const xss = require("xss");
const { ObjectId } = require("mongodb");

const isValidArgument = (arg, argName) => {
  if (typeof arg === "undefined") {
    return {
      result: false,
      message:
        "The " +
        argName +
        " parameter must be passed in and cannot be undefined!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidString = (arg, argName) => {
  if (typeof arg !== "string") {
    return {
      result: false,
      message: argName + " passed in must be a string!",
    };
  }

  if (arg.trim().length === 0) {
    return {
      result: false,
      message:
        argName +
        " passed in cannot be an empty string or consist only of spaces!",
    };
  }

  let result = xss(arg);
  if (!(arg === result)) {
    return {
      result: false,
      message: "The " + argName + " parameter passed in is invalid!"
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidBoolean = (arg, argName) => {
  if (typeof arg !== "boolean") {
    return {
      result: false,
      message: argName + " passed in must be a boolean!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidNumber = (arg, argName) => {
  if ((typeof arg !== "number" && typeof arg !== "string") || isNaN(arg)) {
    return {
      result: false,
      message: argName + " passed in must be either a number or a number in string format!"
    };
  }

  if (typeof arg === "string") {
    let result = xss(arg);
    if (!(arg === Number(result))) {
      return {
        result: false,
        message: "The " + argName + " parameter passed in is invalid!"
      };
    }
  }

  return {
    result: true,
    message: ""
  };
}

const isValidArray = (arg, argName) => {
  if (!Array.isArray(arg)) {
    return {
      result: false,
      message: argName + " passed in must be an array!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidEmail = (email) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const match = email.match(emailRegex);
  if (match === null) {
    return {
      result: false,
      message: "The email provided is invalid!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidPassword = (password) => {
  const passwordRegex = /^[^\s]{6,}$/;
  const match = password.match(passwordRegex);

  if (match === null) {
    return {
      result: false,
      message:
        "The password must be at least 6 characters long and consist only of alphanumeric and special characters!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
  const match = phoneNumber.match(phoneNumberRegex);

  if (match === null) {
    return {
      result: false,
      message:
        "The phone number should be in the format xxx-xxx-xxxx where x is a digit from 0-9!",
    };
  }

  return {
    result: true,
    message: "",
  };
};

const isValidObjectId = (objectId) => {
  try {
    objectId = ObjectId(objectId);
    return {
      result: true,
      message: "",
    };
  } catch (e) {
    return {
      result: false,
      message: "Could not parse the given id in to a valid ObjectId!",
    };
  }
};

const isValidRating = (rating) => {
  if (rating < 1 || rating > 5) {
    return {
      result: false,
      message: "The rating must be a value between 1 and 5!"
    };
  }

  return {
    result: true,
    message: ""
  }
}

const isValidPrice = (price) => {
  if (price <= 0) {
    return {
      result: false,
      message: "The price must be a positive value!"
    };
  }

  return {
    result: true,
    message: ""
  };
}

const isValidQuantity = (quantity) => {
  if (quantity < 0) {
    return {
      result: false,
      message: "The quantity cannot be negative!"
    };
  }

  return {
    result: true,
    message: ""
  };
}

//Function to check for Input array
function checkInputStr(str, varName) {
  if (str === undefined) {
    throw `${varName || "Input string"} is undefined.`;
  }
  checkIsChar(str, varName);
  if (str.trim().length === 0) {
    throw `${varName || "Input string"} is empty.`;
  }
  xssStrCheck(str, varName);
}

//Function to check for valid string
function checkIsChar(str, varName) {
  if (typeof str != "string") {
    throw `${varName || "Given variable"} is not a valid string.`;
  }
}
function xssStrCheck(input, varName) {
  let result = xss(input);
  if (!(input === result)) {
    throw {
      statusCode: 400,
      message: `${varName || "Input variable"} is invalid`,
    };
  }
}

module.exports = {
  checkInputStr,
  isValidString,
  isValidArgument,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidBoolean,
  isValidObjectId,
  isValidArray,
  isValidNumber,
  isValidRating,
  isValidPrice,
  isValidQuantity
};
