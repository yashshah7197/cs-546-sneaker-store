const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const {isValidArgument, isValidString, isValidObjectId, isValidNumber, isValidRating} = require("../data/validate");

router.get("/product/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "reviewId"));
    checkValidation(isValidString(req.params.id, "reviewId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    const reviews = await reviewsData.getAll(req.params.id.trim());
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json(reviews);
    }
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({error: "Internal server error!"});
    }
  }
});

router.post("/", async (req, res) => {
  const reviewData = req.body;

  try {
    checkValidation(isValidArgument(reviewData.reviewedBy, "reviewedBy"));
    checkValidation(isValidString(reviewData.reviewedBy, "reviewedBy"));
    checkValidation(isValidObjectId(reviewData.reviewedBy.trim()));

    checkValidation(isValidArgument(reviewData.reviewFor, "reviewFor"));
    checkValidation(isValidString(reviewData.reviewFor, "reviewFor"));
    checkValidation(isValidObjectId(reviewData.reviewFor.trim()));

    checkValidation(isValidArgument(reviewData.reviewTitle, "title"));
    checkValidation(isValidString(reviewData.reviewTitle, "title"));

    checkValidation(isValidArgument(reviewData.reviewText, "review"));
    checkValidation(isValidString(reviewData.reviewText, "review"));

    checkValidation(isValidArgument(reviewData.reviewRating, "rating"));
    checkValidation(isValidNumber(reviewData.reviewRating, "rating"));
    checkValidation(isValidRating(Number(reviewData.reviewRating)));
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }

  try {
    const review = await reviewsData.create(
      reviewData.reviewedBy.trim(),
      reviewData.reviewFor.trim(),
      reviewData.reviewTitle.trim(),
      reviewData.reviewText.trim(),
      Number(reviewData.reviewRating.trim())
    );
    res.status(200).json(review);
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
    checkValidation(isValidArgument(req.params.id, "reviewId"));
    checkValidation(isValidString(req.params.id, "reviewId"));
    checkValidation(isValidObjectId(req.params.id.trim()));
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }
  try {
    const review = await reviewsData.get(req.params.id.trim());
    res.status(200).json(review);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.put("/:id", async (req, res) => {
  const reviewData = req.body;

  try {
    checkValidation(isValidArgument(req.params.id, "reviewId"));
    checkValidation(isValidString(req.params.id, "reviewId"));
    checkValidation(isValidObjectId(req.params.id.trim()));

    checkValidation(isValidArgument(reviewData.reviewedBy, "reviewedBy"));
    checkValidation(isValidString(reviewData.reviewedBy, "reviewedBy"));
    checkValidation(isValidObjectId(reviewData.reviewedBy.trim()));

    checkValidation(isValidArgument(reviewData.reviewFor, "reviewFor"));
    checkValidation(isValidString(reviewData.reviewFor, "reviewFor"));
    checkValidation(isValidObjectId(reviewData.reviewFor.trim()));

    checkValidation(isValidArgument(reviewData.reviewTitle, "title"));
    checkValidation(isValidString(reviewData.reviewTitle, "title"));

    checkValidation(isValidArgument(reviewData.reviewText, "review"));
    checkValidation(isValidString(reviewData.reviewText, "review"));

    checkValidation(isValidArgument(reviewData.reviewRating, "rating"));
    checkValidation(isValidNumber(reviewData.reviewRating, "rating"));
    checkValidation(isValidRating(Number(reviewData.reviewRating)));
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }

  try {
    await reviewsData.get(req.params.id.trim());
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }

  try {
    const review = await reviewsData.update(
      req.params.id.trim(),
      reviewData.reviewedBy.trim(),
      reviewData.reviewFor.trim(),
      reviewData.title.trim(),
      reviewData.review.trim(),
      Number(reviewData.rating.trim())
    );
    res.status(200).json(review);
  } catch (e) {
    if (e.statusCode) {
      res.status(e.statusCode).json({error: e.message});
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    checkValidation(isValidArgument(req.params.id, "reviewId"));
    checkValidation(isValidString(req.params.id, "reviewId"));
    checkValidation(isValidObjectId(req.params.id.trim()));
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }

  try {
    await reviewsData.get(req.params.id.trim());
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
    return;
  }

  try {
    const review = await reviewsData.remove(req.params.id.trim());
    res.status(200).json(review);
  } catch (e) {
    res.status(e.statusCode).json({ error: e.message });
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
