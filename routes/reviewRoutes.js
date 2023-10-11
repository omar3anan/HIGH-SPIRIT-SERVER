const express = require("express");
const router = express.Router({ mergeParams: true }); //to get access from the previous URL
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

//use nested route for reviews of tour
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "user"),
    reviewController.currentTourwithCurrentuser, //CHECK IF THERE IS ID TO tour AND user
    reviewController.createreview
  )
  .get(
    authController.protect,
    authController.restrictTo("admin", "user"),
    reviewController.getAllreviews
  );

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
