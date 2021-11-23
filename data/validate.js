//Function to check for Input array
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

//Function to check for valid number
function checkIsNumber(num, varName) {
  if (typeof num != "number") {
    throw `${varName || "Given variable"} is not a valid number`;
  }
  if (isNaN(num)) {
    throw `${varName || "Given variable"} is NaN`;
  }
}

//Function to check overall rating
function checkRating(rating) {
  if (rating < 1 || rating > 5) {
    throw "Invalid rating.";
  }
}

//Functiopn to check for valid id
function checkValidObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw "Invalid id.";
  }
}

module.exports = {
  checkInputStr,
  checkIsNumber,
  checkRating,
  checkValidObjectId,
};
