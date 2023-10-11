const express = require("express");
const tourController = require("./../controllers/tourController");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const router = express.Router();
const reviewRouter = require("./reviewRoutes");
//nested route for reviews of tour
//! because of duplicate code
// router
//   .route("/:tourID/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createreview
//   );
router.use("/:tourID/tourReviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
