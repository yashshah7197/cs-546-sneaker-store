const express = require("express");
const router = express.Router();
const data = require("../data");
const qAndAData = data.qAndA;
const {isValidArgument, isValidString, isValidObjectId} = require("../data/validate");

router.get("/product/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "productId"));
    checkValidation(isValidString(req.params.id, "productId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    const qAndAs = await qAndAData.getAll(req.params.id.trim());
    if (qAndAs.length > 0) {
      res.status(200).json(qAndAs);
    } else {
      res.status(404).json(qAndAs);
    }
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else{
      res.status(500).json({error: "Internal server error!"});
    }
  }
});

router.post("/", async (req, res) => {
  const qAndA = req.body;

  try {
    checkValidation(isValidArgument(qAndA.qAndAFor, "qAndFor"));
    checkValidation(isValidString(qAndA.qAndAFor, "qAndAFor"));
    checkValidation(isValidObjectId(qAndA.qAndAFor.trim()));

    checkValidation(isValidArgument(qAndA.questionBy, "questionBy"));
    checkValidation(isValidString(qAndA.questionBy, "questionBy"));
    checkValidation(isValidObjectId(qAndA.questionBy.trim()));

    checkValidation(isValidArgument(qAndA.question, "question"));
    checkValidation(isValidString(qAndA.question, "question"));
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }

  try {
    const newQandA = await qAndAData.create(
      qAndA.qAndAFor.trim(),
      qAndA.questionBy.trim(),
      qAndA.question.trim()
    );
    //res.redirect(`/sneakers/${qAndA.qAndAFor}`);
    res.status(200).json(newQandA);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "qAndAId"));
    checkValidation(isValidString(req.params.id, "qAndAId"));
    checkValidation(isValidObjectId(req.params.id.trim()));
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }
  try {
    const qAndA = await qAndAData.get(req.params.id.trim());
    res.status(200).json(qAndA);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    }
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  const qAndA = req.body;

  try {
    checkValidation(isValidArgument(req.params.id, "qAndAId"));
    checkValidation(isValidString(req.params.id, "qAndAId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    checkValidation(isValidArgument(req.params.answerBy, "answerBy"));
    checkValidation(isValidString(req.params.answerBy, "answerBy"));
    checkValidation(isValidObjectId(req.params.answerBy.trim()));

    checkValidation(isValidArgument(req.params.answer, "answer"));
    checkValidation(isValidString(req.params.answer, "answer"));
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }

  try {
    await qAndAData.get(req.params.id.trim());
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({error: "Internal server error!"});
    }
    return;
  }

  try {
    const answer = await qAndAData.update(
      req.params.id.trim(),
      qAndA.answerBy.trim(),
      qAndA.answer.trim()
    );
    res.status(200).json(answer);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({error: "Internal server error!"});
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "qAndAId"));
    checkValidation(isValidString(req.params.id, "qAndAId"));
    checkValidation(isValidObjectId(req.params.id.trim()));
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }

  try {
    await qAndAData.get(req.params.id.trim());
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({error: "Internal server error!"});
    }
    return;
  }
  try {
    const qAndA = await qAndAData.remove(req.params.id);
    res.status(200).json(qAndA);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({error: "Internal server error!"});
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
