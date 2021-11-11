const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.reports;

const {ObjectId} = require('mongodb');

const create = (reportedBy, reportFor, reportReasons) => {
};

const getAll = () => {
};

const get = (reportId) => {
};

const update = (reportId, reportedBy, reportFor, reportReasons) => {
};

const remove = (reportId) => {
};

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
