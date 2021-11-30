const mongoCollections = require("../config/mongoCollections");
const sneakers = mongoCollections.sneakers;
const reviews = mongoCollections.reviews;

const { ObjectId } = require("mongodb");

const create = async (
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
  const sneakerList = await sneaker.find({ modelName: regEx }).toArray();

  return sneakerList;
};
const update = (
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
) => {};

const remove = async (sneakerId) => {
  const rest = await sneakers();

  const deletionInfo = await rest.deleteOne({ _id: ObjectId(sneakerId) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete post with id of ${id}`;
  }
  return { Deleted: true };
};

const buySneaker = async (sneakerId,userId) => {
 
};


module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
  getAllListedBy,
  getName,
  buySneaker
};
