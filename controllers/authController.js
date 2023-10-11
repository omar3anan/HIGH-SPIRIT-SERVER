const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const AppError = require("../util/appError");
const { promisify } = require("util");
const sendMail = require("../util/email");
const crypto = require("crypto");
//generate a TOKEN
const userToken = (id) => {
  const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN,
  };
  return jwt.sign({ id }, process.env.JWT_SECRET, jwtOptions);
};
const sendResponse = (user, statusCode, res) => {
  const token = userToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
};
//1. use Create Method to create a new user
//2.generate token using jwt and send it in response
exports.signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    sendResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({
      message: "Error in creating a new user",
    });
  }
};

//1. check if email and password exist
//2. check if user exists using findOne and return the user data and save all data in user variable
//3.password is correct ==> using method in user model to compare the hashed login password with the hashed password in database
//4. generate token using jwt and send it in response
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ username }).select("+password");
    //no user in database ==. need to signupo first
    //check if the password is the correct passwrd
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Error in Login", 401));
    }

    sendResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      message: "Error in Login",
    });
  }
};

//why we create this function? to check if the user is logged in or not
//1. check if token exists in header ==> which means if its already in header user logged in
//2. check if token is valid using (promisify and jwt.verify)
//3.save the decoded token in decoded variable which contains the id of the user
//4. check if user still exists using the id in decoded variable
//5.save the user data in currentUser variable ==> THEN save it in req.userx to be used in restrictTo function

exports.protect = async (req, res, next) => {
  try {
    // 1. check if token exists in header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; //Bearer token
    }
    if (!token) {
      return next(new AppError("Please login to get access", 401));
    }
    // 2. check if token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3. check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }
    //used in restrictTo to get the role of the user
    req.userx = currentUser;
    next();
  } catch (err) {
    res.status(500).json({
      message: "Error in protect",
    });
  }
};

exports.restrictTo = (...roles) => {
  //roles=['admin','artist']
  return (req, res, next) => {
    if (!roles.includes(req.userx.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

//1.forget password by sending reset token by email
//2.bab3at ll user el reset token ==>> el howa create password reset token function
//3.tb el function degh bt3mel eh? bt3mel token geded bycrypt and hash
//save fyl databse password reset token
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("No user found with that email", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //create restURL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/ user/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in forgot password",
    });
  }
};

//hakhod el reset token mn el url w a3emlo hash 3alshan akrno bl hashed el mawgod fyl database
exports.resetPassword = async (req, res, next) => {
  //1.get user based on the token
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() }, //gt ==> greater than (Date.now()) ==> current date
  });
  //2.if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  //tb law fy user ==>khod el password el mawgod fyl request
  //update changedPasswordAt property for the user
  //ashel el passwordResetToken w passwordResetExpires
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; //remove the token from database
  user.passwordResetExpires = undefined; //remove the token from database
  await user.save();

  //4.log the user in, send JWT
  const token = userToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    //1.get user from collection
    const user = await User.findById(req.params.id).select("+password");

    //2.check if posted current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(new AppError("Your current password is wrong", 401));
    }
    //3.if so, update password
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();
    const token = userToken(user._id);
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      message: "Error in update password",
    });
  }
};
