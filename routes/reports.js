const express = require("express");
const router = express.Router();
const data = require("../data");
const reportsData = data.reports;
const validation = require("../data/validate");

const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {});

router.post("/", async (req, res) => {
  const reportData = req.body;

  try {
    validation.checkInputStr(reportData.reportedBy, "Reported By");
    validation.checkInputStr(reportData.reportFor, "Report For");
    validation.checkInputStr(reportData.reportReasons, "Report Reason");
    validation.checkInputStr(reportData.type, "Type");
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    const report = await reportsData.create(
      reportData.reportedBy,
      reportData.reportFor,
      reportData.reportReasons,
      reportData.type
    );
    res.status(200).json(report);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});
module.exports = router;
