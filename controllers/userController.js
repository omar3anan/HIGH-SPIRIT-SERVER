const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const AppError = require("../util/appError");
const { promisify } = require("util");
const handlerFactory = require("./factoryHandler");
//JWT (payload, secretOrPrivateKey, [options, callback])

exports.getMe = async (req, res, next) => {
  req.params.id = req.userx.id; //3alshan fyl handler factory 3amlemnha yakhod el id mmn rl url
  next();
};

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined Please Sign up",
  });
};

exports.getUserById = handlerFactory.getOne(User);
exports.deleteCurrentUser = handlerFactory.deleteOne(User);
exports.getAllUsers = handlerFactory.getAll(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
// exports.getUserById = async (req, res) => {
//   try {
//     const userById = await User.findById(req.userx.id);
//     if (!userById) {
//       return next(new AppError("No user found with that ID", 404));
//     }
//     res.status(200).json({
//       status: "success",
//       data: {
//         user: userById,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Error in getting user by id",
//       error: err,
//     });
//   }
// };

// exports.getAllUsers = async (req, res) => {
//   try {
//     const allUsers = await User.find();
//     res.status(200).json({
//       status: "success",
//       results: allUsers.length,
//       data: {
//         users: allUsers,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "This route is not yet defined",
//     });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, //return the new updated data
//       runValidators: true, //run the validator again
//     });
//     res.status(200).json({
//       status: "success",
//       data: updateUser,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Error in updating user",
//       error: err,
//     });
//   }
// };
// exports.likeMusic = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return next(new AppError("No user found with that ID", 404));
//     }
//     user.likedMusics.push(req.body);
//     await user.save();
//     res.status(200).json({
//       status: "success",
//       data: {
//         user: user,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Error in getting user by id",
//       error: err,
//     });
//   }
// };
// exports.deleteCurrentUser = async (req, res) => {
//   try {
//     const deleteUser = await User.findByIdAndDelete(req.userx.id);
//     res.status(200).json({
//       status: "success",
//       data: deleteUser,
//       message: "Delete User success",
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "failed",
//       message: "Error Deleting user",
//     });
//   }
// };
