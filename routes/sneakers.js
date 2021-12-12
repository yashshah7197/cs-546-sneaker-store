const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const usersData = data.users;
const multer = require("multer");
const validation = require("../data/validate");
const nodemailer = require("nodemailer");
const qAndAData = data.qAndA;

const { getBrands } = require("../data/sneakers");
const {
  isValidArgument,
  isValidString,
  isValidNumber,
  isValidPrice,
  isValidObjectId, isValidQuantity,
} = require("../data/validate");

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
  if (!req.session.user) {
    res.redirect("/users/login");
    return;
  }

  try {
    checkValidation(isValidArgument(req.body.brandName, "brandName"));
    checkValidation(isValidString(req.body.brandName, "brandName"));

    checkValidation(isValidArgument(req.body.modelName, "modelName"));
    checkValidation(isValidString(req.body.modelName, "modelName"));

    checkValidation(isValidArgument(req.body.price, "price"));
    checkValidation(isValidNumber(req.body.price.trim(), "price"));
    checkValidation(isValidPrice(Number(req.body.price)));

    checkValidation(isValidArgument(req.body.size7, "size7"));
    checkValidation(isValidNumber(req.body.size7.trim(), "size7"));
    checkValidation(isValidQuantity(Number(req.body.size7.trim())));

    checkValidation(isValidArgument(req.body.size8, "size8"));
    checkValidation(isValidNumber(req.body.size8.trim(), "size8"));
    checkValidation(isValidQuantity(Number(req.body.size8.trim())));

    checkValidation(isValidArgument(req.body.size9, "size9"));
    checkValidation(isValidNumber(req.body.size9.trim(), "size9"));
    checkValidation(isValidQuantity(Number(req.body.size9.trim())));

    checkValidation(isValidArgument(req.body.size10, "size10"));
    checkValidation(isValidNumber(req.body.size10.trim(), "size10"));
    checkValidation(isValidQuantity(Number(req.body.size10.trim())));

    checkValidation(isValidArgument(req.body.size11, "size11"));
    checkValidation(isValidNumber(req.body.size11.trim(), "size11"));
    checkValidation(isValidQuantity(Number(req.body.size11.trim())));

    checkValidation(isValidArgument(req.body.size12, "size12"));
    checkValidation(isValidNumber(req.body.size12.trim(), "size12"));
    checkValidation(isValidQuantity(Number(req.body.size12.trim())));

    let brandName = req.body.brandName.trim();
    let modelName = req.body.modelName.trim();
    let price = req.body.price.trim();

    let sizesAvailable = [
      { size: 7, quantity: Number(req.body.size7.trim()) },
      { size: 8, quantity: Number(req.body.size8.trim()) },
      { size: 9, quantity: Number(req.body.size9.trim()) },
      { size: 10, quantity: Number(req.body.size10.trim()) },
      { size: 11, quantity: Number(req.body.size11.trim()) },
      { size: 12, quantity: Number(req.body.size12.trim()) },
    ];

    let image;
    if (req.file != null && req.file.path != null) {
      image = "../../" + req.file.path.trim();
    } else {
      image = "../../public/uploads/no_image.jpeg";
    }

    const sneakerAdded = await sneakersData.create(
      brandName,
      modelName,
      sizesAvailable,
      Number(price),
      image,
      req.session.user.trim()
    );

    res.render("store/sneakerAdded", {
      title: "Sneaker Added",
      sneaker: sneakerAdded,
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render("store/sneakerSell", {
        title: "Add Sneaker",
        isLoggedIn: !!req.session.user,
        partial: "sell-scripts",
        hasErrors: true,
        error: e.message,
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.get("/listedBy", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/users/login");
    return;
  }

  try {
    let id = req.session.user;
    const sneakers = await sneakersData.getAllListedBy(id.trim());

    res.render("store/sneakerListedby", {
      sneakers: sneakers,
      title: "Sneakers Listed",
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render("store/sneakerListedby", {
        title: "Sneakers Listed",
        isLoggedIn: !!req.session.user,
        partial: "empty-scripts",
        hasErrors: true,
        error: e.message,
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

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
      partial: "list-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render({
        title: "Shop",
        isLoggedIn: !!req.session.user,
        partial: "empty-scripts",
        hasErrors: true,
        error: e.message,
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.get("/sneaker/:id", async (req, res) => {
  if (!req.session.user) {
    res.redirect('/users/login');
    return;
  }
  
  try {
    if (!req.session.user) {
      res.redirect("/users/login");
      return;
    }
    let id = req.params.id;

    checkValidation(isValidArgument(req.params.id, "sneakerId"));
    checkValidation(isValidString(req.params.id, "sneakerId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    const sneaker = await sneakersData.get(id.trim());
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
    if (e.statusCode) {
      res.status(e.statusCode).render("store/sneakerBuy", {
        title: "Shop",
        userID: req.session.user,
        partial: "shop-scripts",
        hasErrors: true,
        error: e.message,
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.get("/listedByUpdate/:id", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/users/login");
    return;
  }

  checkValidation(isValidArgument(req.params.id, "sneakerId"));
  checkValidation(isValidString(req.params.id, "sneakerId"));
  checkValidation(isValidObjectId(req.params.id.trim()));

  try {
    const sneaker = await sneakersData.get(req.params.id.trim());

    res.render("store/sneakerUpdate", {
      title: "Update",
      sneaker: sneaker,
      isLoggedIn: !!req.session.user,
      partial: "sell-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).render("store/sneakerUpdate", {
        title: "Update",
        isLoggedIn: !!req.session.user,
        partial: "sell-scripts",
        hasErrors: true,
        error: e.message,
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.post("/updateSneakerNotifyBuyer", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.body.id, "sneakerId"));
    checkValidation(isValidString(req.body.id, "sneakerId"));
    checkValidation(isValidObjectId(req.body.id.trim()));

    checkValidation(isValidArgument(req.body.brandName, "brandName"));
    checkValidation(isValidString(req.body.brandName, "brandName"));

    checkValidation(isValidArgument(req.body.modelName, "modelName"));
    checkValidation(isValidString(req.body.modelName, "modelName"));

    checkValidation(isValidArgument(req.body.size7, "size7"));
    checkValidation(isValidNumber(req.body.size7.trim(), "size7"));
    checkValidation(isValidQuantity(Number(req.body.size7.trim())));

    checkValidation(isValidArgument(req.body.size8, "size8"));
    checkValidation(isValidNumber(req.body.size8.trim(), "size8"));
    checkValidation(isValidQuantity(Number(req.body.size8.trim())));

    checkValidation(isValidArgument(req.body.size9, "size9"));
    checkValidation(isValidNumber(req.body.size9.trim(), "size9"));
    checkValidation(isValidQuantity(Number(req.body.size9.trim())));

    checkValidation(isValidArgument(req.body.size10, "size10"));
    checkValidation(isValidNumber(req.body.size10.trim(), "size10"));
    checkValidation(isValidQuantity(Number(req.body.size10.trim())));

    checkValidation(isValidArgument(req.body.size11, "size11"));
    checkValidation(isValidNumber(req.body.size11.trim(), "size11"));
    checkValidation(isValidQuantity(Number(req.body.size11.trim())));

    checkValidation(isValidArgument(req.body.size12, "size12"));
    checkValidation(isValidNumber(req.body.size12.trim(), "size12"));
    checkValidation(isValidQuantity(Number(req.body.size12.trim())));

    checkValidation(isValidArgument(req.body.price, "price"));
    checkValidation(isValidNumber(req.body.price.trim(), "price"));
    checkValidation(isValidPrice(Number(req.body.price)));

    const sneaker = await sneakersData.get(req.body.id.trim());
    let sizesAvailable = [
      { size: 7, quantity: Number(req.body.size7.trim()) },
      { size: 8, quantity: Number(req.body.size8.trim()) },
      { size: 9, quantity: Number(req.body.size9.trim()) },
      { size: 10, quantity: Number(req.body.size10.trim()) },
      { size: 11, quantity: Number(req.body.size11.trim()) },
      { size: 12, quantity: Number(req.body.size12.trim()) },
    ];

    let s7 = Number(req.body.size7.trim());
    let s8 = Number(req.body.size8.trim());
    let s9 = Number(req.body.size9.trim());
    let s10 = Number(req.body.size10.trim());
    let s11 = Number(req.body.size11.trim());
    let s12 = Number(req.body.size12.trim());
    let mailList = [];
    let myArr = [];
    for (let i = 0; i < sneaker.notify.length; i++) {
      if (
        (sneaker.notify[i].size === 7 && s7 > 0) ||
        (sneaker.notify[i].size === 8 && s8 > 0) ||
        (sneaker.notify[i].size === 9 && s9 > 0) ||
        (sneaker.notify[i].size === 10 && s10 > 0) ||
        (sneaker.notify[i].size === 11 && s11 > 0) ||
        (sneaker.notify[i].size === 12 && s12 > 0)
      ) {
        mailList.push(sneaker.notify[i].userName);
      } else {
        myArr.push(sneaker.notify[i]);
      }
    }

    await sneakersData.update(
      req.body.id.trim(),
      req.body.brandName.trim(),
      req.body.modelName.trim(),
      sizesAvailable,
      Number(req.body.price),
      sneaker.images,
      sneaker.reviews,
      sneaker.overallRating,
      sneaker.qAndA,
      sneaker.listedBy,
      myArr
    );

    if (mailList.length !== 0) {
      const mailOptions = {
        from: "noreply.solesearch@gmail.com",
        to: mailList,
        subject: `${sneaker.modelName} by ${sneaker.brandName} is in stock. Hurry up and Order Now!`,
        text: "This is a system generated email. Please do not reply to this mail. Thank you!",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          console.log(info);
        }
      });
    }

    res.render("store/sneakerUpdatedSuccessfully", {
      title: "Updated Successfully",
      isLoggedIn: !!req.session.user,
      partial: "empty-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
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
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "sneakerId"));
    checkValidation(isValidString(req.params.id, "sneakerId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    let id = req.params.id.trim();

    const sneaker = await sneakersData.remove(req.params.id.trim());
    res.redirect("/sneakers/");
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;

    checkValidation(isValidArgument(req.body.searchTerm, "searchTerm"));
    checkValidation(isValidString(req.body.searchTerm, "searchTerm"));

    let sneakers = await sneakersData.getName(searchTerm);
    const brands = await sneakersData.getBrands();

    if (!!req.session.user) {
      sneakers = sneakers.filter((s) => s.listedBy !== req.session.user);
    }

    if (sneakers.length > 0) {
      res.render("store/sneakersList", {
        title: "Shop",
        sneakers: sneakers,
        brands: brands,
        isLoggedIn: !!req.session.user,
        partial: "list-scripts",
      });
    } else {
      res.render("store/sneakersList", {
        title: "Shop",
        sneakers: sneakers,
        brands: brands,
        isLoggedIn: !!req.session.user,
        error: "No results found",
        partial: "list-scripts",
      });
    }
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
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
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});
router.post("/buy", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.body.sneakerId, "sneakerId"));
    checkValidation(isValidString(req.body.sneakerId, "sneakerId"));
    checkValidation(isValidObjectId(req.body.sneakerId.trim()));

    checkValidation(isValidArgument(req.body.sneakerSize, "size"));
    checkValidation(isValidString(req.body.sneakerSize.trim(), "size"));

    checkValidation(isValidArgument(req.body.sneakerPrice, "price"));
    checkValidation(isValidNumber(req.body.sneakerPrice.trim(), "price"));
    checkValidation(isValidPrice(Number(req.body.sneakerPrice)));

    let sneakerId = req.body.sneakerId.trim();
    let size = req.body.sneakerSize.trim();
    let price = Number(req.body.sneakerPrice.trim());

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
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.post("/notify", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.body.sneakerId, "sneakerId"));
    checkValidation(isValidString(req.body.sneakerId, "sneakerId"));
    checkValidation(isValidObjectId(req.body.sneakerId.trim()));

    checkValidation(isValidArgument(req.body.sneakerSize, "size"));

    let sizeArray = req.body.sneakerSize.split(",");
    let size = sizeArray[0];

    checkValidation(isValidArgument(size, "size"));
    checkValidation(isValidNumber(size.trim(), "size"));

    let sneakerId = req.body.sneakerId.trim();

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
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.post("/filter", async (req, res) => {
  try {
    let filterOptions = req.body;

    checkValidation(isValidArgument(req.body.brandName, "brandName"));

    checkValidation(isValidArgument(req.body.size, "size"));
    checkValidation(isValidNumber(req.body.size.trim(), "size"));

    checkValidation(isValidArgument(req.body.price, "price"));
    checkValidation(isValidNumber(req.body.price.trim(), "price"));

    let brandName = filterOptions.brandName.trim();
    let size = Number(filterOptions.size.trim());
    let price = Number(filterOptions.price.trim());

    let filteredData = await sneakersData.filter(brandName, size, price);

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
      partial: "list-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message,
    };
  }
};

module.exports = router;
