const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const reviews = data.reviews;

async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  try {
    let review = await reviews.create(
      "619a6f6ffb3a89c138ee0550",
      "619a6f6ffb3a89c138ee0560",
      "Great sneakers",
      "The places sneakers I've ever bought",
      4
    );
  } catch (e) {
    console.log(e);
  }

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main();
