const mongoCollections = require("../config/mongoCollections");
const sneakers = mongoCollections.sneakers;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const user = require("../data/users");
const validation = require("../data/validate");

const { ObjectId } = require("mongodb");

const create = async (
  brandName,
  modelName,
  sizesAvailable,
  price,
  images,
  listedBy
) => {
  const sneakersCollection = await sneakers();
  validation.checkInputStr(brandName);
  validation.checkInputStr(modelName);
  validation.checkIsNumber(price);
  validation.checkInputStr(listedBy);
  validation.checkInputStr(images);
  validation.checkIsChar(brandName);
  validation.checkIsChar(modelName);
  validation.checkIsChar(images);

  let newSneaker = {
    brandName: brandName,
    modelName: modelName,
    sizesAvailable: sizesAvailable,
    price: price,
    images: images,
    reviews: [],
    overallRating: 0,
    qAndA: [],
    listedBy: listedBy,
    notify: [],
  };

  const insertInfo = await sneakersCollection.insertOne(newSneaker);
  if (insertInfo.insertedCount === 0) throw "Could not add Sneaker";

  // const newId = insertInfo.insertedId;
  // const sneaker = await get(String(newId));

  //Added by Hamza || To update user Sneakers Listed field on sneaker creation

  const newId = insertInfo.insertedId;

  let sneaker = await get(newId);

  const usersCollection = await users();

  //Check if the restaurant with the given id exists
  const userInfo = await usersCollection.findOne({
    _id: ObjectId(sneaker.listedBy),
  });
  if (userInfo === null) {
    throw "No user with that id.";
  }

  let userSneakerListed = userInfo.sneakersListed;

  userSneakerListed.push(newId);

  //Update new review object to review collection
  const updateInfo = await usersCollection.updateOne(
    { _id: userInfo._id },
    { $set: { sneakersListed: userSneakerListed } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not add sneaker to the user document.";
  }

  sneaker = await get(newId);

  sneaker._id = sneaker._id.toString();

  return insertInfo.insertedCount;
};

const getAll = async () => {
  const sneaker = await sneakers();
  const sneakerList = await sneaker.find({}).toArray();
  for (let x of sneakerList) x._id = x._id.toString();
  return sneakerList;
};
const getAllListedBy = async (listedBy) => {
  const sneaker = await sneakers();
  const sneakerList = await sneaker.find({ listedBy: listedBy }).toArray();
  for (let x of sneakerList) x._id = x._id.toString();
  return sneakerList;
};
const getAllBuyList = async (userId) => {
  const sneakersCollection = await sneakers();

  const u = await user.get(userId);
  const sneakerList = [];
  for (const x of u.sneakersBought) {
    const sneakerInfo = await sneakersCollection.findOne({
      _id: ObjectId(x.sneakerId),
    });
    sneakerInfo["boughtSize"] = x.size;
    sneakerList.push(sneakerInfo);
  }
  return sneakerList;
};
const get = async (sneakerId) => {
  const sneakersCollection = await sneakers();
  const review = await reviews();

  const rest = await sneakersCollection.findOne({ _id: ObjectId(sneakerId) });
  if (rest === null) throw "No Sneakers with that id";
  rest._id = rest._id.toString();
  return rest;
};
const getName = async (sneakerName) => {
  validation.checkInputStr(sneakerName);
  const sneaker = await sneakers();
  let regEx = new RegExp(sneakerName, "i");
  const sneakerList = await sneaker
    .find({ $or: [{ modelName: regEx }, { brandName: regEx }] })
    .toArray();

  return sneakerList;
};
const update = async (
  sneakerId,
  brandName,
  modelName,
  sizesAvailable,
  price,
  images,
  reviews,
  overallRating,
  qAndA,
  listedBy,
  notify
) => {
  try {
    sneakerId = ObjectId(sneakerId.trim());
  } catch (e) {
    throw {
      statusCode: 400,
      message: "Could not parse the user id in to a valid ObjectId!",
    };
  }
  validation.checkInputStr(listedBy);
  validation.checkInputStr(brandName);
  validation.checkInputStr(modelName);
  validation.checkIsNumber(Number(price));
  //validation.checkInputStr(images);
  validation.checkIsChar(brandName);
  validation.checkIsChar(modelName);
  validation.checkIsChar(images);

  const sneaker = await get(sneakerId.toString());
  const updatedSneaker = {
    brandName: brandName,
    modelName: modelName,
    sizesAvailable: sizesAvailable,
    price: price,
    images: images,
    reviews: reviews,
    overallRating: overallRating,
    qAndA: qAndA,
    listedBy: listedBy,
    notify: notify,
  };

  const sneakerscollection = await sneakers();

  const updatedInfo = await sneakerscollection.updateOne(
    { _id: ObjectId(sneakerId) },
    { $set: updatedSneaker }
  );

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  return await get(sneakerId.toString());
};

const remove = async (sneakerId) => {
  const rest = await sneakers();
  const deletionInfo = await rest.deleteOne({ _id: ObjectId(sneakerId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete post with id of ${id}`;
  }
  return { Deleted: true };
};

const buySneaker = async (userId, sneakerId, size1, price) => {
  let size = size1.split(",");
  // validation.checkInputStr(sneakerId);
  // validation.checkInputStr(size);
  // validation.checkInputStr(userId);

  const userInfo = await user.get(userId.toString());
  userInfo.sneakersBought[userInfo.sneakersBought.length] = {
    sneakerId: sneakerId,
    size: size[0],
    price: price,
  };
  const update1 = await user.update(
    userId,
    userInfo.firstName,
    userInfo.lastName,
    userInfo.email,
    "",
    userInfo.address,
    userInfo.phoneNumber,
    userInfo.isAdmin,
    userInfo.sneakersListed,
    userInfo.sneakersBought
  );
  const sneakerInfo = await get(sneakerId.toString());

  for (const x of sneakerInfo.sizesAvailable) {
    if (x.size == size[0]) {
      x.quantity = x.quantity - 1;
    }
  }
  const updateSneaker = await update(
    sneakerId,
    sneakerInfo.brandName,
    sneakerInfo.modelName,
    sneakerInfo.sizesAvailable,
    sneakerInfo.price,
    sneakerInfo.images,
    sneakerInfo.reviews,
    sneakerInfo.overallRating,
    sneakerInfo.qAndA,
    sneakerInfo.listedBy,
    sneakerInfo.notify
  );

  return update1;
};
const notifySneaker = async (userId, userName, sneakerId, size1) => {
  let size = size1.split(",");
  // validation.checkInputStr(size);
  // validation.checkValidEmail(userName);
  const sneakerInfo = await get(sneakerId.toString());
  sneakerInfo.notify[sneakerInfo.notify.length] = {
    userId: userId,
    userName: userName,
    size: Number(size[0]),
  };

  const updateSneaker = await update(
    sneakerId,
    sneakerInfo.brandName,
    sneakerInfo.modelName,
    sneakerInfo.sizesAvailable,
    sneakerInfo.price,
    sneakerInfo.images,
    sneakerInfo.reviews,
    sneakerInfo.overallRating,
    sneakerInfo.qAndA,
    sneakerInfo.listedBy,
    sneakerInfo.notify
  );

  return updateSneaker;
};

const getBrands = async () => {
  const sneakers = await getAll();
  return new Set(sneakers.map((s) => s.brandName));
};

const filter = async (brandName, size, price) => {
  let sneakers = await getAll();

  if (brandName) {
    sneakers = sneakers.filter((s) => s.brandName === brandName);
  }

  if (size) {
    sneakers = sneakers.filter((s) => {
      for (let obj of s.sizesAvailable) {
        if (obj["size"] === size && obj["quantity"] !== 0) {
          return true;
        }
      }
    });
  }

  if (price) {
    sneakers = sneakers.filter((s) => Number(s.price) < price);
  }

  return sneakers;
};

const notifybuyerWithEmail = async () => {};

module.exports = {
  create,
  getAll,
  get,
  getAllBuyList,
  update,
  remove,
  getAllListedBy,
  getName,
  buySneaker,
  notifySneaker,
  notifybuyerWithEmail,
  getBrands,
  filter,
};
