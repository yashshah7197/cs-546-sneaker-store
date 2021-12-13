const express = require("express");
const router = express.Router();
const data = require("../data");
const reportsData = data.reports;
const reviewsData = data.reviews;
const sneakersData = data.sneakers;
const usersData = data.users;
const qnaData = data.qAndA;

const {
  isValidArgument,
  isValidString,
  isValidObjectId,
} = require("../data/validate");

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(403).json({ error: "Forbidden!" });
      return;
    }

    let user = await usersData.get(req.session.user);
    if (!user.isAdmin) {
      res.status(403).json({ error: "Forbidden!" });
      return;
    }

    let reports = await reportsData.getAll();
    for (let i = 0; i < reports.length; i++) {
      if (reports[i].type == "Review") {
        let r = await reviewsData.get(reports[i].reportFor);
        reports[i].reportFor = r.review;
      } else {
        let q = await qnaData.get(reports[i].reportForQ);
        let a;
        for (let j = 0; j < q.answers.length; j++) {
          if (q.answers[j]._id == reports[i].reportFor) {
            a = q.answers[j].answer;
          }
        }
        reports[i].reportFor = a;
      }
    }
    if (reports.length > 0) {
      res.status(200).render("store/allReports", {
        reports: reports,
        title: "Reports",
        isLoggedIn: !!req.session.user,
        isAdmin: true,
        partial: "report-scripts",
      });
    } else {
      res.status(200).render("store/allReports", {
        reports: reports,
        title: "Reports",
        hasErrors: true,
        error: "No Reports Found",
        isAdmin: true,
        isLoggedIn: !!req.session.user,
        partial: "report-scripts",
      });
    }
  } catch (e) {
    if (e.statusCode) {
      // res.status(e.statusCode).json({ error: e.message });
      res.status(e.statusCode).render("store/allReports", {
        reports: reports,
        title: "Reports",
        hasErrors: true,
        error: e.message,
        isAdmin: true,
        isLoggedIn: !!req.session.user,
        partial: "report-scripts",
      });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.post("/", async (req, res) => {
  if (!req.session.user) {
    res.status(403).json({ error: "Forbidden!" });
    return;
  }

  const reportData = req.body;

  try {
    checkValidation(isValidArgument(reportData.reportedBy, "reportedBy"));
    checkValidation(isValidString(reportData.reportedBy, "reportedBy"));
    checkValidation(isValidObjectId(reportData.reportedBy.trim()));

    checkValidation(isValidArgument(reportData.reportFor, "reportFor"));
    checkValidation(isValidString(reportData.reportFor, "reportFor"));
    checkValidation(isValidObjectId(reportData.reportFor.trim()));

    if (reportData.type === "QnA") {
      checkValidation(isValidArgument(reportData.reportForQ, "reportForQ"));
      checkValidation(isValidString(reportData.reportForQ, "reportForQ"));
      checkValidation(isValidObjectId(reportData.reportFor.trim()));
    }

    checkValidation(isValidArgument(reportData.reportReasons, "reportReasons"));
    checkValidation(isValidString(reportData.reportReasons, "reportReasons"));

    checkValidation(isValidArgument(reportData.type, "type"));
    checkValidation(isValidString(reportData.type, "type"));
  } catch (e) {
    res.status(400).json({ error: e.statusCode });
    return;
  }

  try {
    if (reportData.type === "Review") {
      report = await reportsData.createRevR(
        reportData.reportedBy.trim(),
        reportData.reportFor.trim(),
        reportData.reportReasons.trim(),
        reportData.type.trim()
      );
    } else {
      var report = await reportsData.createQnaR(
        reportData.reportedBy.trim(),
        reportData.reportFor.trim(),
        reportData.reportForQ.trim(),
        reportData.reportReasons.trim(),
        reportData.type.trim()
      );
    }
    res.status(200).json(report);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

router.get("/delete/:id", async (req, res) => {
  // try {
  // } catch (e) {
  //   res.status(400).json({ error: e.statusCode });
  //   return;
  // }

  if (!req.session.user) {
    res.status(403).json({ error: "Forbidden!" });
    return;
  }

  let user = await usersData.get(req.session.user);
  if (!user.isAdmin) {
    res.status(403).json({ error: "Forbidden!" });
    return;
  }

  try {
    let mx;
    let report = await reportsData.get(req.params.id);
    if (report.type === "Review") {
      let reviewX = await reviewsData.get(report.reportFor);
      let sneaker = await sneakersData.get(reviewX.reviewFor);
      let revArr = sneaker.reviews;
      let newArr = [];
      for (let k = 0; k < revArr.length; k++) {
        if (revArr[k] !== reviewX._id) {
          newArr.push(revArr[k]);
        }
      }
      await sneakersData.update(
        sneaker._id,
        sneaker.brandName,
        sneaker.modelName,
        sneaker.sizesAvailable,
        sneaker.price,
        sneaker.images,
        newArr,
        sneaker.overallRating,
        sneaker.qAndA,
        sneaker.listedBy,
        sneaker.notify
      );
      await reviewsData.remove(report.reportFor);
      mx = "Review Deleted Successfully";
    } else {
      let qnaX = await qnaData.get(report.reportForQ);
      let sneaker = await sneakersData.get(qnaX.qAndAFor);
      let qnaArr = sneaker.qAndA;
      let newArr = [];
      for (let k = 0; k < qnaArr.length; k++) {
        if (qnaArr[k] !== qnaX._id) {
          newArr.push(qnaArr[k]);
        }
      }
      await sneakersData.update(
        sneaker._id,
        sneaker.brandName,
        sneaker.modelName,
        sneaker.sizesAvailable,
        sneaker.price,
        sneaker.images,
        sneaker.reviews,
        sneaker.overallRating,
        newArr,
        sneaker.listedBy,
        sneaker.notify
      );
      await qnaData.updateA(report.reportForQ, report.reportFor);
      mx = "Answer Deleted Successfully";
    }
    await reportsData.remove(req.params.id);
    res.render("store/reportDeleted", {
      m: mx,
      title: "Reports",
      isLoggedIn: !!req.session.user,
      isAdmin: true,
      partial: "empty-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

router.get("/keep/:id", async (req, res) => {
  // try {
  // } catch (e) {
  //   res.status(400).json({ error: e.statusCode });
  //   return;
  // }

  if (!req.session.user) {
    res.status(403).json({ error: "Forbidden!" });
    return;
  }

  let user = await usersData.get(req.session.user);
  if (!user.isAdmin) {
    res.status(403).json({ error: "Forbidden!" });
    return;
  }

  try {
    let report = await reportsData.get(req.params.id);
    await reportsData.remove(req.params.id);
    res.render("store/reportDeleted", {
      m: "Report Deleted Successfully",
      title: "Reports",
      isLoggedIn: !!req.session.user,
      isAdmin: true,
      partial: "empty-scripts",
    });
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({ error: e.message });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

const checkValidation = (validation) => {
  if (!validation.result) {
    throw {
      statusCode: 400,
      message: validation.message,
    };
  }
};

module.exports = router;
