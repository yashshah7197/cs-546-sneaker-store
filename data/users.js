const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const {ObjectId} = require('mongodb');

const create = (firstName, lastName, email, passwordHash, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
};

const getAll = () => {
};

const get = (userId) => {
};

const update = (userId, firstName, lastName, email, passwordHash, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
};

const remove = (userId) => {
};

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
