const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;

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
    let rev=[];
    for (const x of sneaker.reviews) 
    {
       rev.push(await reviewData.get(x));
    }
    console.log(rev);
    res.render("store/sneakerBuy", { sneaker: sneaker ,review:rev});
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID"+e });
  }
});
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", { sneaker: sneaker });
    console.log("hell2");
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


router.get('/:id', (req, res) => {
});

module.exports = router;
