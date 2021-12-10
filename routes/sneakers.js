const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const usersData = data.users;
const multer = require("multer");
const validation = require("../data/validate");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply.solesearch@gmail.com",
    pass: "Solesearch@1234",
  },
});

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
    let image;
    if (req.file != null && req.file.path != null) {
      image = "../../" + req.file.path;
    } else {
      image = "../../public/uploads/no_image.jpeg";
    }
    validation.checkInputStr(brandName);
    validation.checkInputStr(modelName);
    validation.checkInputStr(price);
    validation.checkInputStr(image);
    validation.checkIsChar(brandName);
    validation.checkIsChar(modelName);
    validation.checkIsChar(image);

    const sneakerAdded = await sneakersData.create(
      brandName,
      modelName,
      sizesAvailable,
      price,
      image,
      req.session.user
    );
    res.render("store/sneakerAdded", {
      sneaker: sneakerAdded,
      isLoggedIn: !!req.session.user,
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
const { getBrands } = require("../data/sneakers");
//User listed sneakers
router.get("/listedBy", async (req, res) => {
  try {
    let id = req.session.user;
    const sneakers = await sneakersData.getAllListedBy(id);

    res.render("store/sneakerListedby", {
      sneakers: sneakers,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//getall sneakers
router.get("/", async (req, res) => {
  try {
    let sneakers = await sneakersData.getAll();
    let brands = await sneakersData.getBrands();

    if (!!req.session.user) {
      sneakers = sneakers.filter((s) => s.listedBy !== req.session.user);
    }

    res.render("store/sneakersList", {
      title: "Shop",
      sneakers: sneakers,
      brands: brands,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//Changes from "/:id" to add search functionality || Hamza
router.get("/sneaker/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!req.session.user) {
      res.redirect("/users/login");
      return;
    }

    const sneaker = await sneakersData.get(id);
    let rev = [];
    for (const x of sneaker.reviews) {
      rev.push(await reviewData.get(x));
    }
    let qAndA = await qAndAData.getAll(sneaker._id);

    res.render("store/sneakerBuy", {
      title: "Buy",
      userID: req.session.user,
      sneaker: sneaker,
      review: rev,
      qAndAs: qAndA,
      isLoggedIn: !!req.session.user,
      partial: "shop-scripts",
    });
  } catch (e) {
    res.status(404).render("store/sneakerBuy", {
      title: "Shop",
      userID: req.session.user,
      partial: "shop-scripts",
      error: e,
    });
    //res.status(404).json({ message: " There is no Sneaker with that ID" + e });
  }
});

//User updates sneaker
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", {
      title: "Update",
      sneaker: sneaker,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
    //  console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});

router.post("/updateSneakerNotifyBuyer", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.body.id);
    let sizesAvailable = [
      { size: 7, quantity: Number(req.body.size7) },
      { size: 8, quantity: Number(req.body.size8) },
      { size: 9, quantity: Number(req.body.size9) },
      { size: 10, quantity: Number(req.body.size10) },
      { size: 11, quantity: Number(req.body.size11) },
      { size: 12, quantity: Number(req.body.size12) },
    ];

    let s7 = Number(req.body.size7);
    let s8 = Number(req.body.size8);
    let s9 = Number(req.body.size9);
    let s10 = Number(req.body.size10);
    let s11 = Number(req.body.size11);
    let s12 = Number(req.body.size12);
    let mailList = [];
    let myArr = [];
    for (let i = 0; i < sneaker.notify.length; i++) {
      if (
        (sneaker.notify[i].size == "7" && s7 > 0) ||
        (sneaker.notify[i].size == "8" && s8 > 0) ||
        (sneaker.notify[i].size == "9" && s9 > 0) ||
        (sneaker.notify[i].size == "10" && s10 > 0) ||
        (sneaker.notify[i].size == "11" && s11 > 0) ||
        (sneaker.notify[i].size == "12" && s12 > 0)
      ) {
        mailList.push(sneaker.notify[i].userName);
      } else {
        myArr.push(sneaker.notify[i]);
      }
    }

    const update = await sneakersData.update(
      req.body.id,
      req.body.brandName,
      req.body.modelName,
      sizesAvailable,
      req.body.price,
      sneaker.images,
      sneaker.reviews,
      sneaker.overallRating,
      sneaker.qAndA,
      sneaker.listedBy,
      myArr
    );

    var mailOptions = {
      from: "noreply.solesearch@gmail.com",
      to: mailList,
      subject: `${sneaker.modelName} by ${sneaker.brandName} is in stock. Hurry up and Order Now!`,
      text: "This is a system generated email. Please do not reply to this mail. Thank you!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });

    res.render("store/sneakerUpdatedSuccessfully", {
      title: "Updated Successfully",
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/BuyList", async (req, res) => {
  try {
    let id = req.session.user;
    const sneaker = await sneakersData.getAllBuyList(id);
    res.render("store/sneakerBuyList", {
      title: "Sneakers Bought",
      sneaker: sneaker,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
    // console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
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
    validation.checkIsChar(searchTerm);
    const sneakers = await sneakersData.getName(searchTerm);
    //console.log(sneakers);
    if (sneakers.length > 0) {
      res.render("store/sneakersList", {
        sneakers: sneakers,
        isLoggedIn: !!req.session.user,
        partial: "empty-scripts",
      });
    } else {
      res.render("store/sneakersList", {
        title: "Shop",
        sneakers: sneakers,
        isLoggedIn: !!req.session.user,
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
    if (!req.session.user) {
      res.redirect("/users/login");
      return;
    }
    res.render("store/sneakerSell", {
      title: "Add Sneaker",
      isLoggedIn: !!req.session.user,
      partial: "sell-scripts",
    });
  } catch (e) {
    console.log(e);
  }
});
router.post("/buy", async (req, res) => {
  try {
    let sneakerId = req.body.sneakerId;
    let size = req.body.size;
    let price = req.body.sneakerPrice;
    // validation.checkInputStr(sneakerId);
    // validation.checkInputStr(size);
    if (!req.session.user) {
      res.redirect("/users/login");
    } else {
      const sneakers = await sneakersData.buySneaker(
        req.session.user,
        sneakerId,
        size,
        price
      );
      res.redirect("/sneakers/BuyList");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/notify", async (req, res) => {
  try {
    let sneakerId = req.body.id;
    let size = req.body.size;
    // validation.checkInputStr(sneakerId);
    // validation.checkInputStr(size);
    if (!req.session.user) {
      res.redirect("/users/login");
    } else {
      const user = await usersData.get(req.session.user);
      const sneakers = await sneakersData.notifySneaker(
        req.session.user,
        user.email,
        sneakerId,
        size
      );
      res.redirect("/sneakers/sneaker/" + sneakerId);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/filter", async (req, res) => {
  let filterOptions = req.body;

  let brandName = filterOptions.brandName;
  let size = filterOptions.size;
  let price = filterOptions.price;

  try {
    let filteredData = await sneakersData.filter(
      brandName,
      Number(size),
      Number(price)
    );

    if (!!req.session.user) {
      filteredData = filteredData.filter(
        (s) => s.listedBy !== req.session.user
      );
    }

    let brands = await getBrands();

    res.render("store/sneakersList", {
      title: "Shop",
      sneakers: filteredData,
      brands: brands,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.redirect("/");
  }
});

module.exports = router;
