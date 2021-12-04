const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.post("/photo/upload", upload.single("image"), async (req, res) => {
  try {
    let brandName = req.body.brandName;
    let modelName = req.body.modelName;
    let price = req.body.price;
    let sizesAvailable = [
      { size: 7, quantity: Number(req.body.size7) },
      { size: 8, quantity: Number(req.body.size8) },
      { size: 9, quantity: Number(req.body.size9) },
      { size: 10, quantity: Number(req.body.size10) },
      { size: 11, quantity: Number(req.body.size11) },
      { size: 12, quantity: Number(req.body.size12) },
    ];
    let image = "../../" + req.file.path;
    const sneakerAdded = await sneakersData.create(
      brandName,
      modelName,
      sizesAvailable,
      price,
      image,
      "UserId"
    );
    res.render("store/sneakerAdded", {
      sneaker: sneakerAdded,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
const qAndAData = data.qAndA;
const users = data.users;

const { ObjectId } = require("mongodb");
const { update } = require("../data/users");
//User listed sneakers
router.get("/listedBy/:id", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAllListedBy(req.params.id);

    res.render("store/sneakerListedby", {
      sneakers: sneakers,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//getall sneakers
router.get("/", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAll();
    res.render("store/sneakersList", {
      title: "Shop",
      sneakers: sneakers,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//Changes from "/:id" to add search functionality || Hamza
router.get("/sneaker/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.params.id);
    let rev = [];
    for (const x of sneaker.reviews) {
      rev.push(await reviewData.get(x));
    }
    let qAndA = await qAndAData.getAll(sneaker._id);

    res.render("store/sneakerBuy", {
      title: "Buy",
      sneaker: sneaker,
      review: rev,
      qAndAs: qAndA,
      partial: "shop-scripts",
    });
  } catch (e) {
    res.status(404).render("store/sneakerBuy", {
      title: "Shop",
      partial: "shop-scripts",
      error: e,
    });
    //res.status(404).json({ message: " There is no Sneaker with that ID" + e });
  }
});
//User updates sneaker
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", {
      title: "Update",
      sneaker: sneaker,
      partial: "empty-scripts",
    });
    //  console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});
router.get("/BuyList/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.getAllBuyList(req.params.id);

    res.render("store/sneakerBuyList", {
      title: "Shop",
      sneaker: sneaker,
      partial: "shop-scripts",
    });
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
    //console.log(sneakers);
    if (sneakers.length > 0) {
      res.render("store/sneakersList", {
        sneakers: sneakers,
        partial: "empty-scripts",
      });
    } else {
      res.render("store/sneakersList", {
        title: "Shop",
        sneakers: sneakers,
        error: "No results found",
        partial: "empty-scripts",
      });
    }
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/sell", async (req, res) => {
  try {
    res.render("store/sneakerSell", {
      title: "Add Sneaker",
      partial: "empty-scripts",
    });
  } catch (e) {
    console.log(e);
  }
});
router.post("/buy", async (req, res) => {
  try {
    let sneakerId = req.body.id;
    let size = req.body.size;
    const sneakers = await sneakersData.buySneaker(
      "61a6ba5f5bbbf22fa2eb3341",
      sneakerId,
      size
    );
    res.redirect("/sneakers/BuyList/61a6ba5f5bbbf22fa2eb3341");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/notify", async (req, res) => {
  try {
    let sneakerId = req.body.id;
    let size = req.body.size;
    const sneakers = await sneakersData.notifySneaker(
      "61a6ba5f5bbbf22fa2eb3341",
      sneakerId,
      size
    );
    res.redirect("/sneakers//sneaker/"+sneakerId);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = router;
