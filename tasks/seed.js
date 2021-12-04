const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const reviews = data.reviews;
const sneakers = data.sneakers;
const users = data.users;
async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  // firstName,
  // lastName,
  // email,
  // password,
  // address,
  // phoneNumber,
  // isAdmin,
  // sneakersListed,
  // sneakersBought

  try {
    let user = await users.create(
      "Niyati",
      "Bavishi",
      "niyu6@gmail.com",
      "619a6f6ffb3a89c138ee0560",
      "40 Bowers",
      "2016589809",
      false,
      [],
      []
    );
  } catch (e) {
    console.log(e);
  }

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
      "Ni",
      "AF1",
      [
        { size: 3, available: 4 },
        { size: 4, available: 3 },
      ],
      45,
      [],
      ["61a52d717cd09d7df1018521"],
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
