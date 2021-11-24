const mongoCollections = require("../config/mongoCollections");
const reports = mongoCollections.reports;
const validation = require("./validate");

const { ObjectId } = require("mongodb");
// const { reports } = require("../config/mongoCollections");

const create = (reportedBy, reportFor, reportReasons) => {
  validation.checkInputStr(reportedBy, "Reported By");
  // validation.checkValidObjectId(reportedBy);
  validation.checkInputStr(reportFor, "Report For");
  // validation.checkValidObjectId(reportFor);
  validation.checkInputStr(reportReasons, "Report Reasons");
  const reportCollection = await reports();
  //create new report object
  let newReport = {
    reportedBy: reportedBy.trim(),
    reportFor: reportFor.trim(),
    reportReasons: reportReasons.trim(),
  };
  //Insert new report object to report collection
  const insertInfo = await reportCollection.insertOne(newReport);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create report.";
  }

  //Fetch objectId for newly created report
  const newId = insertInfo.insertedId;

  //Fetch the newly created report object
  const addedReport = await reportCollection.findOne({ _id: newId });

  //Convert objectId to string
  addedReport._id = addedReport._id.toString();

  return addedReport;
};

const getAll = () => {
  let emptyResult = [];
  const reportCollection = await reports();

  const reportList = await reportCollection.find({}).toArray();

  //Return an empty array if no reports present in the DB
  if (reportCollection.length <= 0) {
    return emptyResult;
  }

  reportList.forEach((obj) => {
    //Convert objectId to string
    obj._id = obj._id.toString();
  });

  return reportList;
};

const get = (reportId) => {
  validation.checkInputStr(reportId, "Report id");

  //validation.checkValidObjectId(reportId);

  const reportCollection = await reports();

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reportId.trim());

  //Check if the report with the given id exists
  const report = await reportCollection.findOne({ _id: parsedId });
  if (report === null) {
    throw "No report with that id.";
  }

  //Convert ObjectId to string
  report._id = report._id.toString();
  return report;
};

const update = (reportId, reportedBy, reportFor, reportReasons) => {
  validation.checkInputStr(reportId, "Report Id");
  //validation.checkValidObjectId(reportId);
  let parsedId = ObjectId(reportId.trim());

  const reportCollection = await reports();

  //Check if the report with the given id exists
  const existingReport = await reportCollection.findOne({ _id: parsedId });
  if (existingReport === null) {
    throw "No report with that id.";
  }
  validation.checkInputStr(reportedBy, "Reported By");
  //validation.checkValidObjectId(reportedBy);
  validation.checkInputStr(reportFor, "Report For");
  //validation.checkValidObjectId(reportFor);
  validation.checkInputStr(reportReasons, "Report Reasons");

  if (
    existingReport.reportedBy == reportedBy &&
    existingReport.reportFor == reportFor &&
    existingReport.reportReasons == reportReasons.trim()
  ) {
    throw "Update field values are the same as the report field values.";
  }

  //Create new report object
  let updateReport = {
    reportedBy: reportedBy.trim(),
    reportFor: reportFor.trim(),
    reportReasons: reportReasons.trim(),
  };

  //Update new report object to report collection
  const updateInfo = await reportCollection.updateOne(
    { _id: parsedId },
    { $set: updateReport }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the report.";
  }

  //Fetch the updated report object
  const updatedReport = await reportCollection.findOne({
    _id: parsedId,
  });

  //Convert objectId to string
  updatedReport._id = updatedReport._id.toString();

  return updatedReport;
};

const remove = (reportId) => {
  let result = {};
  validation.checkInputStr(reportId, "Id");

  //validation.checkValidObjectId(reportId);

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reportId.trim());

  const reportCollection = await reports();

  //Check if the restaurant with the given id exists
  const report = await reportCollection.findOne({ _id: parsedId });
  if (report === null) {
    throw "No report with that id.";
  }

  const deletionInfo = await reportCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete report with id of ${id}.`;
  }

  result["reportId"] = report._id.toString();
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
