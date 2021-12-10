const res = require("express/lib/response");
const xss = require("xss");
<<<<<<< Updated upstream
const {ObjectId} = require("mongodb");
=======
const { ObjectId } = require("mongodb");
>>>>>>> Stashed changes

const isValidArgument = (arg, argName) => {
  if (typeof arg === "undefined") {
    return {
      result: false,
<<<<<<< Updated upstream
      message: "The " + argName + " parameter must be passed in and cannot be undefined!"
=======
      message:
        "The " +
        argName +
        " parameter must be passed in and cannot be undefined!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
<<<<<<< Updated upstream
    message: ""
  };
}
=======
    message: "",
  };
};
>>>>>>> Stashed changes

const isValidString = (arg, argName) => {
  if (typeof arg !== "string") {
    return {
      result: false,
<<<<<<< Updated upstream
      message: argName + " passed in must be a string!"
=======
      message: argName + " passed in must be a string!",
>>>>>>> Stashed changes
    };
  }

  if (arg.trim().length === 0) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: argName + " passed in cannot be an empty string or consist only of spaces!"
=======
      message:
        argName +
        " passed in cannot be an empty string or consist only of spaces!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
<<<<<<< Updated upstream
    message: ""
  };
}
=======
    message: "",
  };
};
>>>>>>> Stashed changes

const isValidBoolean = (arg, argName) => {
  if (typeof arg !== "boolean") {
    return {
      result: false,
<<<<<<< Updated upstream
      message: argName + " passed in must be a boolean!"
=======
      message: argName + " passed in must be a boolean!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
<<<<<<< Updated upstream
    message: ""
  };
}
=======
    message: "",
  };
};
>>>>>>> Stashed changes

const isValidArray = (arg, argName) => {
  if (!Array.isArray(arg)) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: argName + " passed in must be an array!"
    };
  }

   return {
      result: true,
      message: ""
   };
}

const isValidEmail = (email) => {
  const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
=======
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
>>>>>>> Stashed changes

  const match = email.match(emailRegex);
  if (match === null) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: "The email provided is invalid!"
=======
      message: "The email provided is invalid!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
<<<<<<< Updated upstream
    message: ""
  };
}
=======
    message: "",
  };
};
>>>>>>> Stashed changes

const isValidPassword = (password) => {
  const passwordRegex = /^[^\s]{6,}$/;
  const match = password.match(passwordRegex);

  if (match === null) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: "The password must be at least 6 characters long and consist only of alphanumeric and special characters!"
=======
      message:
        "The password must be at least 6 characters long and consist only of alphanumeric and special characters!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
<<<<<<< Updated upstream
    message: ""
  };
}
=======
    message: "",
  };
};
>>>>>>> Stashed changes

const isValidPhoneNumber = (phoneNumber) => {
  const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
  const match = phoneNumber.match(phoneNumberRegex);

  if (match === null) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: "The phone number should be in the format xxx-xxx-xxxx where x is a digit from 0-9!"
=======
      message:
        "The phone number should be in the format xxx-xxx-xxxx where x is a digit from 0-9!",
>>>>>>> Stashed changes
    };
  }

  return {
    result: true,
    message: "",
  };
<<<<<<< Updated upstream
}
=======
};
>>>>>>> Stashed changes

const isValidObjectId = (objectId) => {
  try {
    objectId = ObjectId(objectId);
    return {
      result: true,
<<<<<<< Updated upstream
      message: ""
=======
      message: "",
>>>>>>> Stashed changes
    };
  } catch (e) {
    return {
      result: false,
<<<<<<< Updated upstream
      message: "Could not parse the given id in to a valid ObjectId!"
    };
  }
}

=======
      message: "Could not parse the given id in to a valid ObjectId!",
    };
  }
};
>>>>>>> Stashed changes

//Function to check for Input array
function checkInputStr(str, varName) {
  if (str == undefined) {
    throw `${varName || "Input string"} is undefined.`;
  }
  checkIsChar(str, varName);
  if (str.trim().length == 0) {
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

//Function to check for valid number
function checkIsNumber(num, varName) {
  if (typeof num != "number") {
    throw `${varName || "Given variable"} is not a valid number`;
  }
  if (isNaN(num)) {
    throw `${varName || "Given variable"} is NaN`;
  }
  xssNumCheck(num, varName);
}

//Function to check overall rating
function checkRating(rating) {
  if (rating < 1 || rating > 5) {
    throw "Invalid rating.";
  }
}

//Function to check for valid id
function checkValidObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw "Invalid id.";
  }
}

function checkIfBoolean(val) {
  if (typeof val !== "boolean") {
    throw "Value should be boolean!";
  }
}

function checkValidEmail(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const match = email.match(emailRegex);

  if (match === null) {
    throw {
      statusCode: 400,
      message: "Invalid email!",
    };
  }
}

function checkValidPassword(password) {
  const passwordRegex = /^[^\s]{6,}$/;
  const match = password.match(passwordRegex);

  if (match === null) {
    throw {
      statusCode: 400,
      message:
        "The password must be at least 6 characters long and consist only of alphanumeric and special characters!",
    };
  }
}

function checkValidPhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
  const match = phoneNumber.match(phoneNumberRegex);

  if (match === null) {
    throw {
      statusCode: 400,
      message:
        "phoneNumber should be in the format xxx-xxx-xxxx where x is a digit from 0-9!",
    };
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

function xssNumCheck(input, varName) {
  let result = xss(input);
  if (!(input === Number(result))) {
    throw {
      statusCode: 400,
      message: `${varName || "Input variable"} is invalid`,
    };
  }
}

module.exports = {
  checkInputStr,
  checkIsNumber,
  checkRating,
  checkValidObjectId,
  checkIfBoolean,
  checkValidEmail,
  checkValidPassword,
  checkValidPhoneNumber,
  checkIsChar,
  isValidString,
  isValidArgument,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidBoolean,
  isValidObjectId,
<<<<<<< Updated upstream
  isValidArray
=======
  isValidArray,
>>>>>>> Stashed changes
};
