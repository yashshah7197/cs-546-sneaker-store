const mongoCollections = require("../config/mongoCollections");
const qAndA = mongoCollections.qAndA;
const sneakers = mongoCollections.sneakers;
const usersData = require("./users");
const validation = require("./validate");

const { ObjectId } = require("mongodb");
const {
  isValidArgument,
  isValidString,
  isValidObjectId,
} = require("./validate");

const create = async (qAndAFor, questionBy, question) => {
  checkValidation(isValidArgument(qAndAFor, "qAndAFor"));
  checkValidation(isValidString(qAndAFor, "qAndAFor"));
  checkValidation(isValidObjectId(qAndAFor.trim()));

  checkValidation(isValidArgument(questionBy, "questionBy"));
  checkValidation(isValidString(questionBy, "questionBy"));
  checkValidation(isValidObjectId(questionBy.trim()));

  checkValidation(isValidArgument(question, "question"));
  checkValidation(isValidString(question, "question"));

  const qAndACollection = await qAndA();

  let newQ = {
    qAndAFor: qAndAFor.trim(),
    questionBy: questionBy.trim(),
    question: question.trim(),
    answers: [],
  };

  const insertInfo = await qAndACollection.insertOne(newQ);
  if (insertInfo.insertedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  const newId = insertInfo.insertedId;

  const sneakerCollection = await sneakers();

  let sneakerId = ObjectId(qAndAFor.trim());

  const sneaker = await sneakerCollection.findOne({ _id: sneakerId });
  if (sneaker === null) {
    throw {
      statusCode: 404,
      message: "No sneaker was found with the given id!",
    };
  }

  let newQandA = sneaker.qAndA;

  newQandA.push(newId.toString());

  const updateInfo = await sneakerCollection.updateOne(
    { _id: sneakerId },
    { $set: { qAndA: newQandA } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  const addedQuestion = await qAndACollection.findOne({ _id: newId });

  let user = await usersData.get(questionBy.trim());

  addedQuestion.questionBy = user.email;
  addedQuestion._id = addedQuestion._id.toString();

  return addedQuestion;
};

const getAll = async (qAndAFor) => {
  checkValidation(isValidArgument(qAndAFor, "qAndAFor"));
  checkValidation(isValidString(qAndAFor, "qAndAFor"));
  checkValidation(isValidObjectId(qAndAFor.trim()));

  let emptyResult = [];

  const qAndACollection = await qAndA();

  let qAndAList = await qAndACollection
    .find({ qAndAFor: qAndAFor.trim() })
    .toArray();

  if (qAndAList.length <= 0) {
    return emptyResult;
  }

  for (const obj of qAndAList) {
    let userInfo = await usersData.get(obj.questionBy);
    obj.questionBy = userInfo.email;
    obj._id = obj._id.toString();
  }

  for (const obj of qAndAList) {
    for (const element of obj.answers) {
      let user = await usersData.get(element.answeredBy);
      element.answeredBy = user.email;
      element._id = element._id.toString();
    }
  }

  return qAndAList;
};

const get = async (qAndAId) => {
  checkValidation(isValidArgument(qAndAId, "qAndAId"));
  checkValidation(isValidString(qAndAId, "qAndAId"));
  checkValidation(isValidObjectId(qAndAId.trim()));

  const qAndACollection = await qAndA();

  let parsedId = ObjectId(qAndAId.trim());

  const qAndAItem = await qAndACollection.findOne({ _id: parsedId });
  if (qAndAItem === null) {
    throw {
      statusCode: 404,
      message: "No Q&A was found with the given id!",
    };
  }

  let userInfo = await usersData.get(qAndAItem.questionBy);
  qAndAItem.questionBy = userInfo.email;

  let answersList = qAndAItem.answers;

  for (const obj of answersList) {
    let userInfo = await usersData.get(obj.answeredBy);
    obj.answeredBy = userInfo.email;
    obj._id = obj._id.toString();
  }

  qAndAItem.answers = answersList;

  qAndAItem._id = qAndAItem._id.toString();
  return qAndAItem;
};

const update = async (qAndAId, answerBy, answer) => {
  checkValidation(isValidArgument(qAndAId, "qAndAId"));
  checkValidation(isValidString(qAndAId, "qAndAId"));
  checkValidation(isValidObjectId(qAndAId.trim()));

  checkValidation(isValidArgument(answerBy, "answerBy"));
  checkValidation(isValidString(answerBy, "answerBy"));
  checkValidation(isValidObjectId(answerBy.trim()));

  checkValidation(isValidArgument(answer, "answer"));
  checkValidation(isValidString(answer, "answer"));

  let result = {};

  let parsedId = ObjectId(qAndAId.trim());

  const qAndACollection = await qAndA();

  const existingQandA = await qAndACollection.findOne({ _id: parsedId });
  if (existingQandA === null) {
    throw {
      statusCode: 404,
      message: "No Q&A was found with the given id!",
    };
  }

  let newAnswers = existingQandA.answers;

  let answerObj = {
    _id: ObjectId(),
    answeredBy: answerBy.trim(),
    answer: answer.trim(),
  };
  newAnswers.push(answerObj);

  const updateInfo = await qAndACollection.updateOne(
    { _id: parsedId },
    { $set: { answers: newAnswers } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  const updatedQandA = await qAndACollection.findOne({
    _id: parsedId,
  });

  let updatedAnswers = updatedQandA.answers;
  let newAnswer = {};
  updatedAnswers.forEach((element) => {
    if ((element._id = answerObj._id)) {
      newAnswer = element;
    }
  });

  result["_id"] = updatedQandA._id.toString();

  newAnswer._id = newAnswer._id.toString();
  let user = await usersData.get(newAnswer.answeredBy);
  newAnswer.answerBy = user.email;

  //Convert objectId to string
  result["answer"] = newAnswer;

  return result;
};

const remove = async (qAndAId) => {
  checkValidation(isValidArgument(qAndAId, "qAndAId"));
  checkValidation(isValidString(qAndAId, "qAndAId"));
  checkValidation(isValidObjectId(qAndAId.trim()));

  let result = {};
  let parsedId = ObjectId(qAndAId.trim());

  const qAndACollection = await qAndA();

  const qAndAItem = await qAndACollection.findOne({ _id: parsedId });
  if (qAndAItem === null) {
    throw {
      statusCode: 404,
      message: "No Q&A was found with the given id!",
    };
  }

  const deletionInfo = await qAndACollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!",
    };
  }

  result["qAndAId"] = qAndAItem._id.toString();
  result["deleted"] = true;

  return result;
};

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
