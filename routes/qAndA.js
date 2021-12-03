const express = require("express");
const router = express.Router();
const data = require("../data");
const qAndAData = data.qAndA;
const validation = require("../data/validate");

const { ObjectId } = require("mongodb");

router.get("/product/:id", async (req, res) => {
  try {
    validation.checkInputStr(req.params.id, "Product Id");
    //validation.checkValidObjectId(req.params.id);
    const qAndAs = await qAndAData.getAll(req.params.id);
    if (qAndAs.length > 0) {
      res.status(200).json(qAndAs);
    } else {
      res.status(404).json(qAndAs);
    }
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.post("/", async (req, res) => {
  const qAndA = req.body;

  try {
    validation.checkInputStr(qAndA.qAndAFor, "QandA For");
    validation.checkInputStr(qAndA.questionBy, "Question by");
    validation.checkInputStr(qAndA.question, "Question");
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    const newQandA = await qAndAData.create(
      qAndA.qAndAFor,
      qAndA.questionBy,
      qAndA.question
    );
    //res.redirect(`/sneakers/${qAndA.qAndAFor}`);
    res.status(200).json(newQandA);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    validation.checkInputStr(req.params.id, "QandA Id");
    //validation.checkValidObjectId(req.params.id);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }
  try {
    const qAndA = await qAndAData.get(req.params.id);
    res.status(200).json(qAndA);
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

router.put("/:id", async (req, res) => {
  const qAndA = req.body;

  try {
    validation.checkInputStr(req.params.id, "QandA Id");
    validation.checkInputStr(qAndA.answerBy, "Answer By");
    validation.checkInputStr(qAndA.answer, "Answer");
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    await qAndAData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ Error: e });
    return;
  }

  try {
    const answer = await qAndAData.update(
      req.params.id,
      qAndA.answerBy,
      qAndA.answer
    );
    res.status(200).json(answer);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    validation.checkInputStr(req.params.id, "QandA id");
    //validation.checkValidObjectId(req.params.id);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    await qAndAData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ Error: e });
    return;
  }
  try {
    const qAndA = await qAndAData.remove(req.params.id);
    res.status(200).json(qAndA);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

module.exports = router;
