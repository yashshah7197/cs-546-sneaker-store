const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const { ObjectId } = require("mongodb");
const { checkInputStr, checkIfBoolean, checkValidEmail, checkValidPassword, checkValidPhoneNumber} = require("./validate");
const bcrypt = require("bcryptjs");

const create = async (
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
  checkInputStr(firstName);
  checkInputStr(lastName);
  checkInputStr(email);
  checkInputStr(password);
  checkInputStr(address);
  checkInputStr(phoneNumber);

  checkIfBoolean(isAdmin);

  checkValidEmail(email.toLowerCase().trim());
  checkValidPassword(password);

  checkValidPhoneNumber(phoneNumber.trim());

  const usersCollection = await users();

  let user = await usersCollection.findOne({
    email: email.toLowerCase().trim(),
  });

  if (user) {
    throw {
      statusCode: 400,
      message: "A user with email " + email + " already exists in the system!",
    };
  }

  let newUser = {
    _id: ObjectId(),
    email: email.toLowerCase().trim(),
    passwordHash: await hashPassword(password),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    address: address.trim(),
    phoneNumber: phoneNumber.trim(),
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
  checkInputStr(userId);

  try {
    userId = ObjectId(userId.trim());
  } catch (e) {
    throw {
      statusCode: 400,
      message: "Could not parse the id in to a valid ObjectId!",
    };
  }

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: userId });
  if (user === null) {
    throw {
      statusCode: 404,
      message: "No user was found with the given id!",
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
  checkInputStr(userId);
  checkInputStr(firstName);
  checkInputStr(lastName);
  checkInputStr(email);
  checkInputStr(password);
  checkInputStr(address);
  checkInputStr(phoneNumber);

  checkIfBoolean(isAdmin);

  checkValidEmail(email.toLowerCase().trim());
  checkValidPassword(password);

  checkValidPhoneNumber(phoneNumber.trim());

  try {
    userId = ObjectId(userId.trim());
  } catch (e) {
    throw {
      statusCode: 400,
      message: "Could not parse the user id in to a valid ObjectId!",
    };
  }

  await get(userId.toString());

  const updatedUser = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase.trim(),
    passwordHash: await hashPassword(password),
    address: address.trim(),
    phoneNumber: phoneNumber.trim(),
    isAdmin: isAdmin,
    sneakersListed: sneakersListed,
    sneakersBought: sneakersBought,
  };

  const usersCollection = await users();

  const updatedInfo = await usersCollection.updateOne(
    { _id: userId },
    { $set: updatedUser }
  );

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  return await get(userId.toString());
};

const remove = async (userId) => {
  checkInputStr(userId);

  try {
    userId = ObjectId(userId.trim());
  } catch (e) {
    throw {
      statusCode: 400,
      message: "Could not parse the user id in to a valid ObjectId!",
    };
  }

  await get(userId.toString());

  const usersCollection = await users();

  const deletionInfo = await usersCollection.deleteOne({ _id: userId });
  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }
};

const hashPassword = async (password) => {
  const saltRounds = 16;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
