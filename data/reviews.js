const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const validation = require("./validate");

const { ObjectId } = require("mongodb");

const create = async (reviewedBy, reviewFor, title, review, rating) => {
  validation.checkInputStr(reviewedBy, "Reviewed By");
  //validation.checkValidObjectId(reviewedBy);
  validation.checkInputStr(reviewFor, "Review For");
  //validation.checkValidObjectId(reviewFor);
  validation.checkInputStr(title, "Title");
  validation.checkInputStr(review, "Review");
  validation.checkIsNumber(rating, "Rating");
  validation.checkRating(rating);

  const reviewCollection = await reviews();

  //Create new review object
  let newReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  //Insert new review object to review collection
  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create review.";
  }

  //Fetch objectId for newly created review
  const newId = insertInfo.insertedId;

  //Fetch the newly created review object
  const addedReview = await reviewCollection.findOne({ _id: newId });

  //Convert objectId to string
  addedReview._id = addedReview._id.toString();

  return addedReview;
};

const getAll = async (reviewFor) => {
  let emptyResult = [];
  validation.checkInputStr(reviewFor, "Review For");

  //validation.checkValidObjectId(reviewFor);
  const reviewCollection = await reviews();

  const reviewList = await reviewCollection
    .find({ reviewFor: reviewFor })
    .toArray();

  //Return an empty array if no restaurants present in the DB
  if (reviewCollection.length <= 0) {
    return emptyResult;
  }

  reviewList.forEach((obj) => {
    //Convert objectId to string
    obj._id = obj._id.toString();
  });

  return reviewList;
};

const get = async (reviewId) => {
  validation.checkInputStr(reviewId, "Review id");

  //validation.checkValidObjectId(reviewId);

  const reviewCollection = await reviews();

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reviewId.trim());

  //Check if the review with the given id exists
  const review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw "No review with that id.";
  }

  //Convert ObjectId to string
  review._id = review._id.toString();
  return review;
};

const update = async (
  reviewId,
  reviewedBy,
  reviewFor,
  title,
  review,
  rating
) => {
  validation.checkInputStr(reviewId, "Review Id");
  //validation.checkValidObjectId(reviewId);

  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  //Check if the restaurant with the given id exists
  const existingReview = await reviewCollection.findOne({ _id: parsedId });
  if (existingReview === null) {
    throw "No review with that id.";
  }

  validation.checkInputStr(reviewedBy, "Reviewed By");
  //validation.checkValidObjectId(reviewedBy);
  validation.checkInputStr(reviewFor, "Review For");
  //validation.checkValidObjectId(reviewFor);
  validation.checkInputStr(title, "Title");
  validation.checkInputStr(review, "Review");
  validation.checkIsNumber(rating, "Rating");
  validation.checkRating(rating);

  if (
    review.reviewedBy == reviewedBy.trim() &&
    review.reviewFor == reviewFor.trim() &&
    review.title == title.trim() &&
    review.review == review.trim() &&
    review.rating == rating
  ) {
    throw "Update field values are the same as the review field values.";
  }

  //Create new review object
  let updateReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  //Update new review object to review collection
  const updateInfo = await reviewCollection.updateOne(
    { _id: parsedId },
    { $set: updateReview }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the review.";
  }

  //Fetch the updated review object
  const updatedReview = await reviewCollection.findOne({
    _id: parsedId,
  });

  //Convert objectId to string
  updatedReview._id = updatedReview._id.toString();

  return updatedReview;
};

const remove = async (reviewId) => {
  let result = {};
  validation.checkInputStr(reviewId, "id");

  //validation.checkValidObjectId(reviewId);

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  //Check if the restaurant with the given id exists
  const review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw "No review with that id.";
  }

  const deletionInfo = await reviewCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}.`;
  }

  result["reviewId"] = review._id.toString();
  result["deleted"] = true;

  return result;
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
