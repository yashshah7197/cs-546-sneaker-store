const express = require("express");
const app = express();
const connection = require("./config/mongoConnection");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

const Handlebars = require("handlebars");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
  partialsDir: ["views/partials/"],
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

// app.use;
// app.use('/public', static);
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

const server = app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

function shutdown() {
  server.close(async () => {
    const db = await connection.connectToDb();
    await connection.closeConnection();
    console.log("Shut down successfully!");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
