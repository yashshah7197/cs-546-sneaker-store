const express = require('express');
const router = express.Router();
const data = require('../data');
const sneakersData = data.sneakers;

const {ObjectId} = require('mongodb');

router.get('/', (req, res) => {
});

module.exports = router;