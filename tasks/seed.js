const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const reviews = data.reviews;
const sneakers = data.sneakers;
const reports = data.reports;

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

  try {
    let sneaker = await sneakers.create(
      "Nike",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0560",
      []
    );
  } catch (e) {
    console.log(e);
  }

  try {
    let sneaker = await sneakers.create(
      "Nike",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0560",
      []
    );
  } catch (e) {
    console.log(e);
  }
  try {
    let sneaker = await sneakers.create(
      "Nike",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0560",
      []
    );
  } catch (e) {
    console.log(e);
  }
  try {
    let sneaker = await sneakers.create(
      "Nike",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0563",
      []
    );
  } catch (e) {
    console.log(e);
  }
  try {
    let sneaker = await sneakers.create(
      "Nike",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0563",
      []
    );
  } catch (e) {
    console.log(e);
  }
  try {
    let sneaker = await sneakers.create(
      "Adidas",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      [],
      0,
      [],
      "619a6f6ffb3a89c138ee0563",
      []
    );
  } catch (e) {
    console.log(e);
  }

  // try {
  //   let report = await reports.create(
  //     "619a6f6ffb3a89c138ee0563",
  //     "619a6f6ffb3a89c138ee0563",
  //     "test"
  //   );
  // } catch (e) {
  //   console.log(e);
  // }

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main();
