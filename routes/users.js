const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;

const {ObjectId} = require('mongodb');

router.get('/', (req, res) => {
});

module.exports = router;
