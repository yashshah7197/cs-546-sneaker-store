const mongoCollections = require("../config/mongoCollections");
const sneakers = mongoCollections.sneakers;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const user = require("../data/users");
const validation = require("../data/validate");

const { ObjectId } = require("mongodb");
const {isValidArgument, isValidString, isValidNumber, isValidPrice} = require("../data/validate");
const {isValidArray, isValidObjectId, isValidRating} = require("./validate");

const create = async (
  brandName,
  modelName,
  sizesAvailable,
  price,
  images,
  listedBy
) => {
  checkValidation(isValidArgument(brandName, "brandName"));
  checkValidation(isValidString(brandName, "brandName"));

  checkValidation(isValidArgument(modelName, "modelName"));
  checkValidation(isValidString(modelName, "modelName"));

  checkValidation(isValidArgument(sizesAvailable, "sizesAvailable"));
  checkValidation(isValidArray(sizesAvailable, "sizesAvailable"));

  checkValidation(isValidArgument(price, "price"));
  checkValidation(isValidNumber(price, "price"));
  checkValidation(isValidPrice(price));

  checkValidation(isValidArgument(images, "images"));
  checkValidation(isValidString(images, "images"));

  checkValidation(isValidArgument(listedBy, "listedBy"));
  checkValidation(isValidString(listedBy, "listedBy"));
  checkValidation(isValidObjectId(listedBy.trim()));

  const sneakersCollection = await sneakers();

  let newSneaker = {
    brandName: brandName.trim(),
    modelName: modelName.trim(),
    sizesAvailable: sizesAvailable,
    price: price,
    images: images.trim(),
    reviews: [],
    overallRating: 0,
    qAndA: [],
    listedBy: listedBy.trim(),
    notify: [],
  };

  const insertInfo = await sneakersCollection.insertOne(newSneaker);
  if (insertInfo.insertedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }

  const newId = insertInfo.insertedId;

  let sneaker = await get(newId.toString());

  const usersCollection = await users();

  const userInfo = await usersCollection.findOne({
    _id: ObjectId(sneaker.listedBy),
  });

  if (userInfo === null) {
    throw {
      statusCode: 404,
      message: "No user was found with the given id!"
    };
  }

  let userSneakerListed = userInfo.sneakersListed;

  userSneakerListed.push(newId.toString());

  const updateInfo = await usersCollection.updateOne(
    { _id: userInfo._id },
    { $set: { sneakersListed: userSneakerListed } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }

  sneaker = await get(newId.toString());

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
  checkValidation(isValidArgument(listedBy, "listedBy"));
  checkValidation(isValidString(listedBy, "listedBy"));
  checkValidation(isValidObjectId(listedBy.trim()));

  const sneaker = await sneakers();
  const sneakerList = await sneaker.find({ listedBy: listedBy.trim() }).toArray();
  for (let x of sneakerList) x._id = x._id.toString();
  return sneakerList;
};
const getAllBuyList = async (userId) => {
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId.trim()));

  const sneakersCollection = await sneakers();

  const u = await user.get(userId.trim());
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
  checkValidation(isValidArgument(sneakerId, "sneakerId"));
  checkValidation(isValidString(sneakerId, "sneakerId"));
  checkValidation(isValidObjectId(sneakerId.trim()));

  const sneakersCollection = await sneakers();
  const review = await reviews();

  const rest = await sneakersCollection.findOne({ _id: ObjectId(sneakerId.trim()) });
  if (rest === null) throw {
    statusCode: 404,
    message: "No sneaker was found with the given id!"
  };

  rest._id = rest._id.toString();
  return rest;
};

const getName = async (sneakerName) => {
  checkValidation(isValidArgument(sneakerName, "sneakerName"));
  checkValidation(isValidString(sneakerName, "sneakerName"));

  const sneaker = await sneakers();
  let regEx = new RegExp(sneakerName.trim(), "i");

  return await sneaker
      .find({$or: [{modelName: regEx}, {brandName: regEx}]})
      .toArray();
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
  checkValidation(isValidArgument(sneakerId, "sneakerId"));
  checkValidation(isValidString(sneakerId, "sneakerId"));
  checkValidation(isValidObjectId(sneakerId.trim()));

  checkValidation(isValidArgument(brandName, "brandName"));
  checkValidation(isValidString(brandName, "brandName"));

  checkValidation(isValidArgument(modelName, "modelName"));
  checkValidation(isValidString(modelName, "modelName"));

  checkValidation(isValidArgument(sizesAvailable, "sizesAvailable"));
  checkValidation(isValidArray(sizesAvailable, "sizesAvailable"));

  checkValidation(isValidArgument(price, "price"));
  checkValidation(isValidNumber(price, "price"));
  checkValidation(isValidPrice(price));

  checkValidation(isValidArgument(images, "images"));
  checkValidation(isValidString(images, "images"));

  checkValidation(isValidArgument(reviews, "reviews"));
  checkValidation(isValidArray(reviews, "reviews"));

  checkValidation(isValidArgument(overallRating, "overallRating"));
  checkValidation(isValidNumber(overallRating, "overallRating"));

  checkValidation(isValidArgument(qAndA, "qAndA"));
  checkValidation(isValidArray(qAndA, "qAndA"));

  checkValidation(isValidArgument(listedBy, "listedBy"));
  checkValidation(isValidString(listedBy, "listedBy"));
  checkValidation(isValidObjectId(listedBy.trim()));

  checkValidation(isValidArgument(notify, "notify"));
  checkValidation(isValidArray(notify, "notify"));

  const sneaker = await get(sneakerId.toString());
  const updatedSneaker = {
    brandName: brandName.trim(),
    modelName: modelName.trim(),
    sizesAvailable: sizesAvailable,
    price: price,
    images: images.trim(),
    reviews: reviews,
    overallRating: overallRating,
    qAndA: qAndA,
    listedBy: listedBy.trim(),
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
  checkValidation(isValidArgument(sneakerId, "sneakerId"));
  checkValidation(isValidString(sneakerId, "sneakerId"));
  checkValidation(isValidObjectId(sneakerId.trim()));

  const rest = await sneakers();
  const deletionInfo = await rest.deleteOne({ _id: ObjectId(sneakerId) });
  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }
  return { Deleted: true };
};

const buySneaker = async (userId, sneakerId, size1, price) => {
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId.trim()));

  checkValidation(isValidArgument(sneakerId, "sneakerId"));
  checkValidation(isValidString(sneakerId, "sneakerId"));
  checkValidation(isValidObjectId(sneakerId.trim()));

  let size = size1.split(",");

  checkValidation(isValidNumber(size[0].trim()));
  checkValidation(isValidNumber(size[1].trim()));

  checkValidation(isValidArgument(price, "price"));
  checkValidation(isValidNumber(price, "price"));
  checkValidation(isValidPrice(price));

  const userInfo = await user.get(userId.toString());
  userInfo.sneakersBought[userInfo.sneakersBought.length] = {
    sneakerId: sneakerId.trim(),
    size: Number(size[0]),
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
    if (x.size === Number(size[0])) {
      x.quantity = x.quantity - 1;
    }
  }
  const updateSneaker = await update(
    sneakerId.trim(),
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
  checkValidation(isValidArgument(userId, "userId"));
  checkValidation(isValidString(userId, "userId"));
  checkValidation(isValidObjectId(userId.trim()));

  checkValidation(isValidArgument(userName, "userName"));
  checkValidation(isValidString(userName, "userName"));

  checkValidation(isValidArgument(sneakerId, "sneakerId"));
  checkValidation(isValidString(sneakerId, "sneakerId"));
  checkValidation(isValidObjectId(sneakerId.trim()));


  checkValidation(isValidNumber(size1.trim()));
  const sneakerInfo = await get(sneakerId.toString().trim());
  sneakerInfo.notify[sneakerInfo.notify.length] = {
    userId: userId.trim(),
    userName: userName.trim(),
    size: Number(size1.trim()),
  };

  const updateSneaker = await update(
    sneakerId.trim(),
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
  checkValidation(isValidArgument(brandName, "brandName"));

  checkValidation(isValidArgument(size, "size"));
  checkValidation(isValidNumber(size, "size"));

  checkValidation(isValidArgument(price, "price"));
  checkValidation(isValidNumber(price, "price"));

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

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message
    };
  }
}

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
