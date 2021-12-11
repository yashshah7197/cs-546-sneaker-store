const express = require("express");
const router = express.Router();
const data = require("../data");
const reportsData = data.reports;

const { ObjectId } = require("mongodb");
const {isValidArgument, isValidString, isValidObjectId} = require("../data/validate");

router.get("/", (req, res) => {});

router.post("/", async (req, res) => {
  const reportData = req.body;

  try {
    checkValidation(isValidArgument(reportData.reportedBy, "reportedBy"));
    checkValidation(isValidString(reportData.reportedBy, "reportedBy"));
    checkValidation(isValidObjectId(reportData.reportedBy.trim()));

    checkValidation(isValidArgument(reportData.reportFor, "reportFor"));
    checkValidation(isValidString(reportData.reportFor, "reportFor"));
    checkValidation(isValidObjectId(reportData.reportFor.trim()));

    checkValidation(isValidArgument(reportData.reportReasons, "reportReasons"));
    checkValidation(isValidString(reportData.reportReasons, "reportReasons"));

    checkValidation(isValidArgument(reportData.type, "type"));
    checkValidation(isValidString(reportData.type, "type"));
  } catch (e) {
    res.status(400).json({ error: e.statusCode });
    return;
  }

  try {
    const report = await reportsData.create(
      reportData.reportedBy.trim(),
      reportData.reportFor.trim(),
      reportData.reportReasons.trim(),
      reportData.type.trim()
    );
    res.status(200).json(report);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message
    };
  }
}

module.exports = router;
