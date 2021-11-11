const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.qAndA;

const {ObjectId} = require('mongodb');

const create = (qAndAFor, questionBy, question, answers) => {
};

const getAll = () => {
};

const get = (qAndAId) => {
};

const update = (qAndAId, qAndAFor, questionBy, question, answers) => {
};

const remove = (qAndAId) => {
};

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
