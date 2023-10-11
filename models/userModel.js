const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  username: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Please tell us your name!"],
    validate: [validator.isEmail, "Please provide a valid email"],
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "artist"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, //to not show password in response
  },
  //to check if the password is correct or not
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "Passwords are not the same!",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  likedSongs: {
    type: [String],
    default: [],
  },
  playlists: {
    type: Array,
    default: [],
  },
  img: {
    type: String,
    default: "default.jpg",
  },
});
//! THIS 3ayda 3ala object
// between receiceing data and saving to DB and sending response
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //no passowrd

  //encrypt password and save it to database
  this.password = await bcrypt.hash(this.password, 12); //? 12 is the cost parameter
  //remove the confirm password from database
  this.passwordConfirm = undefined; //dont persist passwordConfirm to the database
  next();
});

//this.isModified("password") and this.isNew are mongoose methods
userSchema.pre("save", function (next) {
  //if the password is not modified or the document is new ya3ny awel mara yb2a mafesh passwordChangedAt
  if (!this.isModified("password") || this.isNew) return next();
  //passwordChangedAt is 1 second before the token is created
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.saveLikedSong = async function (songId) {
  if (!this.likedSongs.includes(songId)) {
    this.likedSongs.push(songId);
    await this.save();
  }
};

// ! Used in Login page and change password page
userSchema.methods.correctPassword = async function (
  candidatePasswordx,
  userPasswordx
) {
  return await bcrypt.compare(candidatePasswordx, userPasswordx);
};

//ba3mel hena resetToken hab3to ll user fyl email
//ba3d keda ba3mel encrypt ll resetToken w a save it in database
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); //random string
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); //encrypted string
  //reset token for the user and password reset token save it in database
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  //hab3to ll user
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
