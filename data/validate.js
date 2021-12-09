const res = require("express/lib/response");
const xss = require("xss");

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
};
