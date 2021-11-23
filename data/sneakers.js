const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.sneakers;

const { ObjectId } = require("mongodb");

const create = (
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

const getAll = () => {};

const get = (sneakerId) => {};

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

const remove = (sneakerId) => {};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
