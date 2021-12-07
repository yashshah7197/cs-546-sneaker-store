const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const reviews = data.reviews;
const sneakers = data.sneakers;
const qAndA = data.qAndA;
const users = data.users;
async function main() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  let user1;
  let user2;
  let user3;
  let user4;
  let sneaker1;
  let review1;
  let question1;
  let answer1;
  let sneaker2;
  let sneaker3;
  try {
    user1 = await users.create(
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
    user2 = await users.create(
      "Hamza",
      "Shabir",
      "hbuch@stevens.com",
      "$2a$16$GAwCrtWAa0tSxfYEBbw3iOLoZETeB1rlS15JslUWiMBspazTILlm.",
      "Sherman Ave",
      "201-324-4429",
      false,
      [],
      []
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user3 = await users.create(
      "Yash",
      "Shah",
      "yshah@stevens.edu",
      "$2a$08$cc.AkrSoB1n6fkqeOJ6w5.1jZg/s.o1ErKQ2EaYZShhY7QlR2e9Ke",
      "Washington Park",
      "201-658-9889",
      false,
      [],
      []
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user4 = await users.create(
      "Kheevar",
      "Choudary",
      "kc@stevens.edu",
      "$2a$08$AeTOUZaMLZ4L74zprNuQp.OHggEYwU529hud8Fkk5MdX6E0E6sPau",
      "Grace Street",
      "201-658-2149",
      false,
      [],
      []
    );
  } catch (e) {
    console.log(e);
  }

  try {
    sneaker1 = await sneakers.create(
      "Nike",
      "Air Force 1",
      [
        { size: 8, quantity: 20 },
        { size: 9, quantity: 12 },
      ],
      90,
      ["../../public/uploads/AF1.jpeg"],
      user1._id.toString()
    );
  } catch (e) {
    console.log(e);
  }

  try {
    review1 = await reviews.create(
      user2._id,
      sneaker1._id,
      "Great sneakers",
      "The best sneakers I've ever bought",
      4
    );
  } catch (e) {
    console.log(e);
  }

  try {
    question1 = await qAndA.create(
      sneaker1._id,
      user3._id.toString(),
      "How's the cushioning?"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    answer1 = await qAndA.update(
      question1._id,
      user2._id.toString(),
      "Too good. Very comfy."
    );
  } catch (e) {
    console.log(e);
  }

  try {
    sneaker2 = await sneakers.create(
      "adidas",
      "Yeezy Boost 350",
      [
        { size: 8, quantity: 10 },
        { size: 9, quantity: 25 },
        { size: 10, quantity: 15 },
      ],
      250,
      ["../../public/uploads/Yeezy350.jpeg"],
      user4._id.toString()
    );
  } catch (e) {
    console.log(e);
  }

  // try {
  //   let sneaker = await sneakers.create(
  //     "Nike",
  //     "AF1",
  //     [
  //       { size: 3, available: 4 },
  //       { size: 4, available: 3 },
  //     ],
  //     45,
  //     [],
  //     [],
  //     0,
  //     [],
  //     "619a6f6ffb3a89c138ee0560",
  //     []
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   let sneaker = await sneakers.create(
  //     "Nike",
  //     "AF1",
  //     [
  //       { size: 3, available: 4 },
  //       { size: 4, available: 3 },
  //     ],
  //     45,
  //     [],
  //     [],
  //     0,
  //     [],
  //     "619a6f6ffb3a89c138ee0563",
  //     []
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   let sneaker = await sneakers.create(
  //     "Nike",
  //     "AF1",
  //     [
  //       { size: 3, available: 4 },
  //       { size: 4, available: 3 },
  //     ],
  //     45,
  //     [],
  //     [],
  //     0,
  //     [],
  //     "619a6f6ffb3a89c138ee0563",
  //     []
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   let sneaker = await sneakers.create(
  //     "Adidas",
  //     "AF1",
  //     [
  //       { size: 3, available: 4 },
  //       { size: 4, available: 3 },
  //     ],
  //     45,
  //     [],
  //     [],
  //     0,
  //     [],
  //     "619a6f6ffb3a89c138ee0563",
  //     []
  //   );
  // } catch (e) {
  //   console.log(e);
  // }

  console.log("Done seeding database");

  await dbConnection.closeConnection();
}

main();
