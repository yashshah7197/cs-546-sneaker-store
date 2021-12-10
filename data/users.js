const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const { ObjectId } = require("mongodb");
const {
  isValidArgument, isValidString, isValidPassword, isValidEmail, isValidPhoneNumber,
  isValidBoolean, isValidObjectId, isValidArray,
} = require("./validate");
const bcrypt = require("bcryptjs");

const create = async (
  email,
  password,
  isAdmin,
) => {
  checkValidation(isValidArgument(email, "email"));
  checkValidation(isValidString(email, "email"));
  checkValidation(isValidEmail(email.trim()));

  checkValidation(isValidArgument(password, "password"));
  checkValidation(isValidString(password, "password"));
  checkValidation(isValidPassword(password));

  checkValidation(isValidArgument(isAdmin, "isAdmin"));
  checkValidation(isValidBoolean(isAdmin, "isAdmin"));

  const usersCollection = await users();

  let user = await usersCollection.findOne({
    email: email.toLowerCase().trim(),
  });

  if (user) {
    throw {
      statusCode: 400,
      message: "A user with email " + email.toLowerCase().trim() + " already exists in the system!",
    };
  }

  let newUser = {
    _id: ObjectId(),
    email: email.toLowerCase().trim(),
    passwordHash: await hashPassword(password),
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    isAdmin: isAdmin,
    sneakersListed: [],
    sneakersBought: [],
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  return newUser;
};

const getAll = async () => {
  const usersCollection = await users();

  const usersArray = await usersCollection.find().toArray();
  usersArray.forEach((user) => {
    user["passwordHash"] = "";
  });

  return usersArray;
};

const get = async (userId) => {
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId));

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: ObjectId(userId) });
  if (user === null) {
    throw {
      statusCode: 404,
      message: "No user was found with the given user id!",
    };
  }

  return user;
};

const update = async (
  userId,
  firstName,
  lastName,
  email,
  password,
  address,
  phoneNumber,
  isAdmin,
  sneakersListed,
  sneakersBought
) => {
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId));

  checkValidation(isValidArgument(firstName, "firstName"));
  checkValidation(isValidString(firstName, "firstName"));

  checkValidation(isValidArgument(lastName, "lastName"));
  checkValidation(isValidString(lastName, "lastName"));

  checkValidation(isValidArgument(email, "email"));
  checkValidation(isValidString(email, "email"));
  checkValidation(isValidEmail(email.trim()));

  checkValidation(isValidArgument(password, "password"));

  checkValidation(isValidArgument(address, "address"));
  checkValidation(isValidString(address, "address"));

  checkValidation(isValidArgument(phoneNumber, "phoneNumber"));
  checkValidation(isValidString(phoneNumber, "phoneNumber"));
  checkValidation(isValidPhoneNumber(phoneNumber));

  checkValidation(isValidArgument(isAdmin, "isAdmin"));
  checkValidation(isValidBoolean(isAdmin, "isAdmin"));

  checkValidation(isValidArgument(sneakersListed, "sneakersListed"));
  checkValidation(isValidArray(sneakersListed, "sneakersListed"));

  checkValidation(isValidArgument(sneakersBought, "sneakersBought"));
  checkValidation(isValidArray(sneakersBought, "sneakersBought"));

  let user = await get(userId);

  const updatedUser = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    address: address.trim(),
    phoneNumber: phoneNumber.trim(),
    isAdmin: isAdmin,
    sneakersListed: sneakersListed,
    sneakersBought: sneakersBought,
  };

  if (password.length === 0) {
    updatedUser["passwordHash"] = user["passwordHash"];
  } else {
    checkValidation(isValidString(password, "password"));
    checkValidation(isValidPassword(password));
    updatedUser["passwordHash"] = await hashPassword(password);
  }

  const usersCollection = await users();

  const updatedInfo = await usersCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: updatedUser }
  );

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  return await get(userId);
};

const remove = async (userId) => {
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId));

  await get(userId);

  const usersCollection = await users();

  const deletionInfo = await usersCollection.deleteOne({ _id: ObjectId(userId) });
  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }
};

const checkUser = async (email, password) => {
  checkValidation(isValidArgument(email, "email"));
  checkValidation(isValidString(email, "email"));
  checkValidation(isValidEmail(email.trim()));

  checkValidation(isValidArgument(password, "password"));
  checkValidation(isValidString(password, "password"));
  checkValidation(isValidPassword(password));

  const usersCollection = await users();

  let user = await usersCollection.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw {
      statusCode: 400,
      message: "Either the username or password is invalid",
    };
  }

  let passwordMatch = await bcrypt.compare(password, user["passwordHash"]);
  if (!passwordMatch) {
    throw {
      statusCode: 400,
      message: "Either the username or password is invalid",
    };
  }

  return user;
};

const hashPassword = async (password) => {
  const saltRounds = 16;
  return await bcrypt.hash(password, saltRounds);
};

const getUserID = async (email) => {
  checkValidation(isValidArgument(email, "email"));
  checkValidation(isValidString(email, "email"));
  checkValidation(isValidEmail(email));

  const usersCollection = await users();

  const user = await usersCollection.findOne({ email: email.toLowerCase().trim() });
  if (user === null) {
    throw {
      statusCode: 404,
      message: "No user was found with the given id!",
    };
  }

  return user._id.toString();
};

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message
    };
  }
}

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
  checkUser,
  getUserID,
};
