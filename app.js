const express = require("express");
const app = express();
const connection = require("./config/mongoConnection");
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
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
