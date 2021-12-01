const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const users = data.users;

const { ObjectId } = require("mongodb");

router.get("/listedBy/:id", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAllListedBy(req.params.id);

    res.render("store/sneakerListedby", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAll();
    res.render("store/sneakersList", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.params.id);
    let rev = [];
    for (const x of sneaker.reviews) {
      rev.push(await reviewData.get(x));
    }

    res.render("store/sneakerBuy", { sneaker: sneaker, review: rev });
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" + e });
  }
});
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", { sneaker: sneaker });
  //  console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});
router.get("/BuyList/:id", async (req, res) => {
    try {
      const sneaker = await sneakersData.getAllBuyList(req.params.id);
  
      res.render("store/sneakerBuyList", { sneaker: sneaker });
     // console.log("hell2");
    } catch (e) {
      res.status(404).json({ message: " There is no Sneaker with that ID" });
    }
  });
router.get("/delete/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.remove(req.params.id);
    res.redirect("/sneakers/");
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "There is no Restaurant with that ID" });
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const sneakers = await sneakersData.getName(searchTerm);
    console.log(sneakers);
    res.render("store/sneakersList", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/buy", async (req, res) => {
    try {
      let sneakerId = req.body.id;
      let size = req.body.size;
    //   console.log(req.body);
       const sneakers = await sneakersData.buySneaker("61a6ba5f5bbbf22fa2eb3341",sneakerId,size);
    //   console.log(sneakers);
    //   res.render("store/sneakersList", { sneakers: sneakers });
    res.redirect('/sneakers/BuyList/61a6ba5f5bbbf22fa2eb3341');
    } catch (e) {
      res.sendStatus(500);
    }
  });
module.exports = router;
