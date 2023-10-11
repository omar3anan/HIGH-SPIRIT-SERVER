const Review = require("../models/reviewModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const factoryHandler = require("./factoryHandler");

exports.currentTourwithCurrentuser = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID; //nested routes
  if (!req.body.user) req.body.user = req.userx.id;
  next();
});
exports.createreview = factoryHandler.createOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.getReviewById = factoryHandler.getOne(Review);
exports.getAllreviews = factoryHandler.getAll(Review);

// exports.getAllreviews = catchAsync(async (req, res, next) => {
//   //3alshan ageb el reviews bta3t el tour ela ana wa2ef 3leha
//   let tourID = {};
//   if (req.params.tourID) tourID = { tour: req.params.tourID }; //nested routes
//   const reviews = await Review.find(tourID);
//   if (!reviews) {
//     return next(new AppError("No review found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.getReviewById = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(new AppError("No review found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });

// exports.createreview = catchAsync(async (req, res, next) => {
//   const newreview = await Review.create(req.body);
//   if (!newreview) {
//     return next(new AppError("No review found with that ID", 404));
//   }
//   res.status(201).json({
//     status: "success",
//     data: {
//       review: newreview,
//     },
//   });
// });
// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, //to return the new updated document
//     runValidators: true, //to run the validators again
//   });

//   if (!review) {
//     return next(new AppError("No review found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });

// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndDelete(req.params.id);
//   if (!review) {
//     return next(new AppError("No review found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });
