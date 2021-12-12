const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const sneakers = mongoCollections.sneakers;
const validation = require("./validate");
const usersData = require("./users");

const { ObjectId } = require("mongodb");
const {
  isValidArgument,
  isValidString,
  isValidObjectId,
  isValidNumber,
  isValidRating,
} = require("./validate");

const create = async (reviewedBy, reviewFor, title, review, rating) => {
  checkValidation(isValidArgument(reviewedBy, "reviewedBy"));
  checkValidation(isValidString(reviewedBy, "reviewedBy"));
  checkValidation(isValidObjectId(reviewedBy.trim()));

  checkValidation(isValidArgument(reviewFor, "reviewFor"));
  checkValidation(isValidString(reviewFor, "reviewFor"));
  checkValidation(isValidObjectId(reviewFor.trim()));

  checkValidation(isValidArgument(title, "title"));
  checkValidation(isValidString(title, "title"));

  checkValidation(isValidArgument(review, "review"));
  checkValidation(isValidString(review, "review"));

  checkValidation(isValidArgument(rating, "rating"));
  checkValidation(isValidNumber(rating, "rating"));
  checkValidation(isValidRating(rating));

  const reviewCollection = await reviews();

  let newReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  const newId = insertInfo.insertedId;

  const sneakerCollection = await sneakers();

  let sneakerId = ObjectId(reviewFor.trim());

  const sneaker = await sneakerCollection.findOne({ _id: sneakerId });
  if (sneaker === null) {
    throw {
      statusCode: 404,
      message: "No sneaker was found with the given id!",
    };
  }

  let newReviews = sneaker.reviews;

  newReviews.push(newId.toString());

  const updateInfo = await sneakerCollection.updateOne(
    { _id: sneakerId },
    { $set: { reviews: newReviews } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  let avgRating = await calAvgRating(reviewFor.trim());

  const addedReview = await reviewCollection.findOne({ _id: newId });

  let user = await usersData.get(reviewedBy.trim());

  addedReview.reviewedBy = user.email;

  addedReview._id = addedReview._id.toString();

  return addedReview;
};

const getAll = async (reviewFor) => {
  checkValidation(isValidArgument(reviewFor, "reviewFor"));
  checkValidation(isValidString(reviewFor, "reviewFor"));
  checkValidation(isValidObjectId(reviewFor.trim()));

  let emptyResult = [];

  const reviewCollection = await reviews();

  let reviewList = await reviewCollection
    .find({ reviewFor: reviewFor.trim() })
    .toArray();

  if (reviewCollection.length <= 0) {
    return emptyResult;
  }

  for (const obj of reviewList) {
    let userInfo = await usersData.get(obj.reviewedBy);
    obj.reviewedBy = userInfo.email;
    obj._id = obj._id.toString();
  }

  return reviewList;
};

const get = async (reviewId) => {
  checkValidation(isValidArgument(reviewId, "reviewId"));
  checkValidation(isValidString(reviewId, "reviewId"));
  checkValidation(isValidObjectId(reviewId.trim()));

  const reviewCollection = await reviews();

  let parsedId = ObjectId(reviewId.trim());

  let review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw {
      statusCode: 404,
      message: "No review was found with the given id!",
    };
  }

  let userInfo = await usersData.get(review.reviewedBy);

  review.reviewedBy = userInfo.email;
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
  checkValidation(isValidArgument(reviewId, "reviewId"));
  checkValidation(isValidString(reviewId, "reviewId"));
  checkValidation(isValidObjectId(reviewId.trim()));

  checkValidation(isValidArgument(reviewedBy, "reviewedBy"));
  checkValidation(isValidString(reviewedBy, "reviewedBy"));
  checkValidation(isValidObjectId(reviewedBy.trim()));

  checkValidation(isValidArgument(reviewFor, "reviewFor"));
  checkValidation(isValidString(reviewFor, "reviewFor"));
  checkValidation(isValidObjectId(reviewFor.trim()));

  checkValidation(isValidArgument(title, "title"));
  checkValidation(isValidString(title, "title"));

  checkValidation(isValidArgument(review, "review"));
  checkValidation(isValidString(review, "review"));

  checkValidation(isValidArgument(rating, "rating"));
  checkValidation(isValidNumber(rating, "rating"));
  checkValidation(isValidRating(rating));

  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  const existingReview = await reviewCollection.findOne({ _id: parsedId });
  if (existingReview === null) {
    throw {
      statusCode: 404,
      message: "No review was found with the given id!",
    };
  }

  if (
    review.reviewedBy === reviewedBy.trim() &&
    review.reviewFor === reviewFor.trim() &&
    review.title === title.trim() &&
    review.review === review.trim() &&
    review.rating === rating
  ) {
    throw {
      statusCode: 400,
      message: "Update field values are the same as the review field values!",
    };
  }

  let updateReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  const updateInfo = await reviewCollection.updateOne(
    { _id: parsedId },
    { $set: updateReview }
  );
  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  let avgRating = await calAvgRating(reviewFor.trim());
  //await calAvgRating(reviewFor.trim());

  const updatedReview = await reviewCollection.findOne({
    _id: parsedId,
  });

  updatedReview._id = updatedReview._id.toString();

  return updatedReview;
};

const remove = async (reviewId) => {
  checkValidation(isValidArgument(reviewId, "reviewId"));
  checkValidation(isValidString(reviewId, "reviewId"));
  checkValidation(isValidObjectId(reviewId.trim()));

  let result = {};

  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  const review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw {
      statusCode: 404,
      message: "No review was found with the given id!",
    };
  }

  const deletionInfo = await reviewCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  result["reviewId"] = review._id.toString();
  result["deleted"] = true;

  return result;
};

async function calAvgRating(productId) {
  checkValidation(isValidArgument(productId, "productId"));
  checkValidation(isValidString(productId, "productId"));
  checkValidation(isValidObjectId(productId.trim()));

  let rating = 0;
  let parsedId = ObjectId(productId.trim());

  const sneakerCollection = await sneakers();

  const sneaker = await sneakerCollection.findOne({ _id: parsedId });
  if (sneaker === null) {
    throw {
      statusCode: 404,
      message: "No sneaker was found with the given id!",
    };
  }

  const reviewCollection = await reviews();

  let reviewArr = sneaker.reviews;
  let overallRating = 0;

  for (let element of reviewArr) {
    let parsedId = ObjectId(element.trim());

    const review = await reviewCollection.findOne({ _id: parsedId });

    if (review === null) {
      throw {
        statusCode: 404,
        message: "No review was found with the given id!",
      };
    }

    overallRating += review.rating;
  }

  if (overallRating > 0) {
    overallRating = overallRating / reviewArr.length;
    overallRating = overallRating.toFixed(2);
  }

  let updatedSneaker = await sneakerCollection.updateOne(
    { _id: parsedId },
    { $set: { overallRating: overallRating } }
  );

  if (updatedSneaker.modifiedCount === 0 && sneaker.overallRating !== rating) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  } else {
    return true;
  }
}

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message,
    };
  }
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
