const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.reviews;

const {ObjectId} = require('mongodb');

const create = (reviewedBy, reviewFor, title, review, rating) => {
};

const getAll = () => {
};

const get = (reviewId) => {
};

const update = (reviewId, reviewedBy, reviewFor, title, review, rating) => {
};

const remove = (reviewId) => {
};

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
