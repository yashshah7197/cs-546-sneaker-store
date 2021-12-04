const mongoCollections = require("../config/mongoCollections");
const sneakers = mongoCollections.sneakers;
const reviews = mongoCollections.reviews;
const users = require("../data/users");

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
  return true;
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

  const user = await users.get(userId);
  const sneakerList = [];
  for (const x of user.sneakersBought) {
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

const buySneaker = async (userId, sneakerId, size) => {
  const userInfo = await users.get(userId);
  userInfo.sneakersBought[userInfo.sneakersBought.length] = {
    sneakerId: sneakerId,
    size: size,
  };
  const update1 = await users.update(
    userId,
    userInfo.firstName,
    userInfo.lastName,
    userInfo.email,
    userInfo.passwordHash,
    userInfo.address,
    userInfo.phoneNumber,
    userInfo.isAdmin,
    userInfo.sneakersListed,
    userInfo.sneakersBought
  );
  const sneakerInfo = await get(sneakerId.toString());
  let count = 0,
    flag = false;

  for (const x of sneakerInfo.sizesAvailable) {
    if (x.size == size) {
      x.available = x.available - 1;

      if (x.available == 0) {
        flag = true;
        break;
      }
    }
    count++;
  }
  if (flag == true) {
    sneakerInfo.sizesAvailable.splice(count, 1);
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
};
