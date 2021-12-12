const express = require("express");
const router = express.Router();
const data = require("../data");

const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  let user;
  let isAdmin;

  if (req.session.user) {
    user = await data.users.get(req.session.user);
    isAdmin = user.isAdmin;
  }

  res.render("store/home", {
    title: "Home",
    isLoggedIn: !!req.session.user,
    isAdmin: isAdmin,
    partial: "empty-scripts"
  });
});

module.exports = router;
