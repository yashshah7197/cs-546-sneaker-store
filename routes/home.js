const express = require("express");
const router = express.Router();
const data = require("../data");

const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  res.render("store/home", { title: "Home", partial: "empty-scripts" });
});

module.exports = router;
