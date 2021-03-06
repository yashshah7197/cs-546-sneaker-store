const usersRoutes = require("./users");
const sneakersRoutes = require("./sneakers");
const reviewsRoutes = require("./reviews");
const reportsRoutes = require("./reports");
const qAndAsRoutes = require("./qAndA");
const homeRoutes = require("./home");

const configRoutes = (app) => {
  app.use("/home", homeRoutes);
  app.use("/users", usersRoutes);
  app.use("/sneakers", sneakersRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/reports", reportsRoutes);
  app.use("/qAndA", qAndAsRoutes);

  app.use("/", (req, res) => {
    res.redirect("/home");
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found!" });
  });

  app.use(function (err, req, res, next) {
    if (!err) {
      return next();
    }
    console.log(err);
    res.status(400).json({ error: "Bad request!" });
  });
};

module.exports = configRoutes;
