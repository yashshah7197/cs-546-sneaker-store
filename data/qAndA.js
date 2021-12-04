const mongoCollections = require("../config/mongoCollections");
const qAndA = mongoCollections.qAndA;
const sneakers = mongoCollections.sneakers;
const validation = require("./validate");

const { ObjectId } = require("mongodb");

const create = async (qAndAFor, questionBy, question) => {
  validation.checkInputStr(qAndAFor, "Question for");
  //validation.checkValidObjectId(qAndAFor);
  validation.checkInputStr(questionBy, "Question by");
  //validation.checkValidObjectId(questionBy);
  validation.checkInputStr(question, "Question");

  const qAndACollection = await qAndA();

  //Create new review object
  let newQ = {
    qAndAFor: qAndAFor,
    questionBy: questionBy,
    question: question.trim(),
    answers: [],
  };

  //Insert new question object to qAndA collection
  const insertInfo = await qAndACollection.insertOne(newQ);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create question.";
  }

  //Fetch objectId for newly created question
  const newId = insertInfo.insertedId;

  const sneakerCollection = await sneakers();

  let sneakerId = ObjectId(qAndAFor);

  //Check if the restaurant with the given id exists
  const sneaker = await sneakerCollection.findOne({ _id: sneakerId });
  if (sneaker === null) {
    throw "No sneaker with that id.";
  }

  let newQandA = sneaker.qAndA;

  newQandA.push(newId.toString());

  //Update new review object to review collection
  const updateInfo = await sneakerCollection.updateOne(
    { _id: sneakerId },
    { $set: { qAndA: newQandA } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not add QandA to sneaker.";
  }

  //Fetch the newly created reviquestionew object
  const addedQuestion = await qAndACollection.findOne({ _id: newId });

  //Convert objectId to string
  addedQuestion._id = addedQuestion._id.toString();

  return addedQuestion;
};

const getAll = async (qAndAFor) => {
  let emptyResult = [];
  validation.checkInputStr(qAndAFor, "Question For");

  //validation.checkValidObjectId(reviewFor);
  const qAndACollection = await qAndA();

  const qAndAList = await qAndACollection
    .find({ qAndAFor: qAndAFor })
    .toArray();

  //Return an empty array if no restaurants present in the DB
  if (qAndAList.length <= 0) {
    return emptyResult;
  }

  qAndAList.forEach((obj) => {
    //Convert objectId to string
    obj._id = obj._id.toString();
  });

  return qAndAList;
};

const get = async (qAndAId) => {
  validation.checkInputStr(qAndAId, "QAndA id");

  //validation.checkValidObjectId(reviewId);
  const qAndACollection = await qAndA();

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(qAndAId.trim());

  //Check if the review with the given id exists
  const qAndAItem = await qAndACollection.findOne({ _id: parsedId });
  if (qAndAItem === null) {
    throw "No review with that id.";
  }

  //Convert ObjectId to string
  qAndAItem._id = qAndAItem._id.toString();
  return qAndAItem;
};

const update = async (qAndAId, answerBy, answer) => {
  let result = {};
  validation.checkInputStr(qAndAId, "QandA Id");
  //validation.checkValidObjectId(qAndAId);

  let parsedId = ObjectId(qAndAId.trim());

  const qAndACollection = await qAndA();

  //Check if the restaurant with the given id exists
  const existingQandA = await qAndACollection.findOne({ _id: parsedId });
  if (existingQandA === null) {
    throw "No Q and A with that id.";
  }

  validation.checkInputStr(answerBy, "Answer by");
  validation.checkInputStr(answer, "Answer");

  let newAnswers = existingQandA.answers;

  let answerObj = {
    _id: ObjectId(),
    answeredBy: answerBy.trim(),
    answer: answer,
  };
  newAnswers.push(answerObj);

  //   //Create new review object
  //   let updateAnswer = {
  //     qAndAFor: existingQandA.qAndAFor,
  //     questionBy: existingQandA.questionBy,
  //     question: existingQandA.question,
  //     answers: answers,
  //   };

  //Update new review object to review collection
  const updateInfo = await qAndACollection.updateOne(
    { _id: parsedId },
    { $set: { answers: newAnswers } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not answer the question.";
  }

  //Fetch the updated review object
  const updatedQandA = await qAndACollection.findOne({
    _id: parsedId,
  });

  let updatedAnswers = updatedQandA.answers;
  let newAnswer = {};
  updatedAnswers.forEach((element) => {
    if ((element._id = answerObj._id)) {
      newAnswer = element;
      newAnswer._id = newAnswer._id.toString();
    }
  });

  result["_id"] = updatedQandA._id.toString();

  //Convert objectId to string
  result["answer"] = newAnswer;

  return result;
};

const remove = async (qAndAId) => {
  let result = {};
  validation.checkInputStr(qAndAId, "QandA id");

  //validation.checkValidObjectId(qAndAId);

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(qAndAId.trim());

  const qAndACollection = await qAndA();

  //Check if the qAndA with the given id exists
  const qAndAItem = await qAndACollection.findOne({ _id: parsedId });
  if (qAndAItem === null) {
    throw "No Q and A with that id.";
  }

  const deletionInfo = await qAndACollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete Q and A with id of ${id}.`;
  }

  result["qAndAId"] = qAndAItem._id.toString();
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
