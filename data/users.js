const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const {ObjectId} = require('mongodb');
const {checkInputStr} = require("./validate");
const bcrypt = require("bcrypt");

const create = async (firstName, lastName, email, password, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
    checkInputStr(firstName);
    checkInputStr(lastName);
    checkInputStr(email);
    checkInputStr(password);
    checkInputStr(address);
    checkInputStr(phoneNumber);

    const usersCollection = await users();

    let user = usersCollection.findOne({
        email: email.toLowerCase()
    });

    if (user) {
        throw {
            statusCode: 400,
            message: "A user with email " + email + " already exists in the system!"
        }
    }

    let newUser = {
        _id: ObjectId(),
        email: email,
        passwordHash: await hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        isAdmin: isAdmin,
        sneakersListed: [],
        sneakersBought: []
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) {
        throw {
            statusCode: 500,
            message: "Internal server error!"
        }
    }

    return {userInserted: true};
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
            message: "Could not parse the id in to a valid ObjectId!"
        }
    }

    const usersCollection = await users();

    const user = await usersCollection.findOne({_id: userId});
    if (user === null) {
        throw {
            statusCode: 404,
            message: "No user was found with the given id!"
        }
    }

    user["passwordHash"] = "";

    return user;
};

const update = (userId, firstName, lastName, email, passwordHash, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
};

const remove = (userId) => {
};

const hashPassword = async (password) => {
    const saltRounds = 16;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
