const express = require('express');
const router = express.Router();
const data = require('../data');
const qAndAData = data.qAndA;

const {ObjectId} = require('mongodb');

router.get('/', (req, res) => {
});

module.exports = router;
