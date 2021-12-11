//Function to check for Input string
function checkInputStr(str, varName) {
  if (str == undefined) {
    throw `${varName || "Input string"} is undefined.`;
  }
  checkIsChar(str, varName);
  if (str.trim().length == 0) {
    throw `${varName || "Input string"} is empty.`;
  }
}

//Function to check for valid string
function checkIsChar(str, varName) {
  if (typeof str != "string") {
    throw `${varName || "Given variable"} is not a valid string.`;
  }
}

//Function to check overall rating
function checkRating(rating) {
  if (rating < 0 || rating > 5) {
    throw "Invalid rating.";
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
}

function checkIsValidEmail(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const match = email.match(emailRegex);
  if (match === null) {
    throw "The email provided is invalid!";
  }
}

function checkIsValidPassword(password) {
  const passwordRegex = /^[^\s]{6,}$/;
  const match = password.match(passwordRegex);

  if (match === null) {
    throw "The password must be at least 6 characters long and consist only of alphanumeric and special characters!";
  }
}

function checkIsValidPhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
  const match = phoneNumber.match(phoneNumberRegex);

  if (match === null) {
    throw "The phone number should be in the format xxx-xxx-xxxx where x is a digit from 0-9!";
  }
}
