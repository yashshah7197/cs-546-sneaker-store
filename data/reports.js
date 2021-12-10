const mongoCollections = require("../config/mongoCollections");
const reports = mongoCollections.reports;

const { ObjectId } = require("mongodb");
const {isValidArgument, isValidString, isValidObjectId} = require("./data/validate");

const create = async (reportedBy, reportFor, reportReasons, type) => {
  checkValidation(isValidArgument(reportedBy, "reportedBy"));
  checkValidation(isValidString(reportedBy, "reportedBy"));
  checkValidation(isValidObjectId(reportedBy.trim()));

  checkValidation(isValidArgument(reportFor, "reportFor"));
  checkValidation(isValidString(reportFor, "reportFor"));
  checkValidation(isValidObjectId(reportFor.trim()));

  checkValidation(isValidArgument(reportReasons, "reportReasons"));
  checkValidation(isValidString(reportReasons, "reportReasons"));

  checkValidation(isValidArgument(type, "type"));
  checkValidation(isValidString(type, "type"));

  const reportCollection = await reports();

  let newReport = {
    reportedBy: reportedBy.trim(),
    reportFor: reportFor.trim(),
    reportReasons: reportReasons.trim(),
    type: type.trim(),
  };

  const insertInfo = await reportCollection.insertOne(newReport);
  if (insertInfo.insertedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }

  const newId = insertInfo.insertedId;

  const addedReport = await reportCollection.findOne({ _id: newId });

  addedReport._id = addedReport._id.toString();

  return addedReport;
};

const getAll = async () => {
  let emptyResult = [];
  const reportCollection = await reports();

  const reportList = await reportCollection.find({}).toArray();

  if (reportCollection.length <= 0) {
    return emptyResult;
  }

  reportList.forEach((obj) => {
    //Convert objectId to string
    obj._id = obj._id.toString();
  });

  return reportList;
};

const get = async (reportId) => {
  checkValidation(isValidArgument(reportId, "reportId"));
  checkValidation(isValidString(reportId, "reportId"));
  checkValidation(isValidObjectId(reportId.trim()));

  const reportCollection = await reports();

  let parsedId = ObjectId(reportId.trim());

  const report = await reportCollection.findOne({ _id: parsedId });
  if (report === null) {
    throw {
      statusCode: 404,
      message: "No report was found with the given id!"
    };
  }
  report._id = report._id.toString();

  return report;
};

const update = async (reportId, reportedBy, reportFor, reportReasons) => {
  checkValidation(isValidArgument(reportId, "reportId"));
  checkValidation(isValidString(reportId, "reportId"));
  checkValidation(isValidObjectId(reportId.trim()));

  checkValidation(isValidArgument(reportedBy, "reportedBy"));
  checkValidation(isValidString(reportedBy, "reportedBy"));
  checkValidation(isValidObjectId(reportedBy.trim()));

  checkValidation(isValidArgument(reportFor, "reportFor"));
  checkValidation(isValidString(reportFor, "reportFor"));
  checkValidation(isValidObjectId(reportFor.trim()));

  checkValidation(isValidArgument(reportReasons, "reportReasons"));
  checkValidation(isValidString(reportReasons, "reportReasons"));

  let parsedId = ObjectId(reportId.trim());

  const reportCollection = await reports();

  const existingReport = await reportCollection.findOne({ _id: parsedId });
  if (existingReport === null) {
    throw {
      statusCode: 404,
      message: "No report was found with the given id!"
    };
  }

  if (
    existingReport.reportedBy === reportedBy.trim() &&
    existingReport.reportFor === reportFor.trim() &&
    existingReport.reportReasons === reportReasons.trim()
  ) {
    throw {
      statusCode: 400,
      message: "Update field values are the same as the report field values!"
    };
  }

  let updateReport = {
    reportedBy: reportedBy.trim(),
    reportFor: reportFor.trim(),
    reportReasons: reportReasons.trim(),
  };

  const updateInfo = await reportCollection.updateOne(
    { _id: parsedId },
    { $set: updateReport }
  );
  if (updateInfo.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }

  const updatedReport = await reportCollection.findOne({
    _id: parsedId,
  });

  updatedReport._id = updatedReport._id.toString();

  return updatedReport;
};

const remove = async (reportId) => {
  checkValidation(isValidArgument(reportId, "reportId"));
  checkValidation(isValidString(reportId, "reportId"));
  checkValidation(isValidObjectId(reportId.trim()));

  let result = {};

  let parsedId = ObjectId(reportId.trim());

  const reportCollection = await reports();

  const report = await reportCollection.findOne({ _id: parsedId });
  if (report === null) {
    throw {
      statusCode: 404,
      message: "No report was found with the given id!"
    };
  }

  const deletionInfo = await reportCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw {
      statusCode: 500,
      message: "Internal server error!"
    };
  }

  result["reportId"] = report._id.toString();
  result["deleted"] = true;

  return result;
};

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
  update,
  remove,
};
