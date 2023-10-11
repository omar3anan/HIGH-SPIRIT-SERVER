const mongoose = require("mongoose");
const User = require("./userModel");
const Tour = require("./tourModel");
const objectID = mongoose.Schema.ObjectId;
const revireModel = new mongoose.Schema(
  {
    review: {
      type: String,
      requires: [true, "Review can not be empty"],
      minlength: [10, "Review must be more than 10 characters"],
      maxlength: [200, "Review must be less than 200 characters"],
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: objectID, //parent referencing el review gowa el tour
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: objectID, //parent referencing
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true }, //
    toObject: { virtuals: true },
  }
);

//ay find hal2yha ha3mlha populate
revireModel.pre(/^find/, function (next) {
  this.populate({
    path: "user tour",
  });
  next();
});

const Review = mongoose.model("Review", revireModel);
module.exports = Review;
