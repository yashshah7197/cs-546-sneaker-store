const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;

const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  console.log("Welcome");
});

module.exports = router;
