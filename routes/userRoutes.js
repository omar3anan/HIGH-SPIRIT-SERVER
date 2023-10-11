const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
router.param("id", (req, res, next, val) => {
  console.log(`Book id is ${val}`);
  next();
});

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router
  .route("/me")
  .get(
    authController.protect,
    userController.getMe,
    userController.getUserById
  );
router
  .route("/")
  .post(userController.createUser)
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    userController.getMe,
    userController.deleteCurrentUser
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    userController.deleteUser
  );

router
  .route("/forgetpassword")
  .post(authController.protect, authController.forgotPassword);
router
  .route("/resetpassword/:token")
  .patch(authController.protect, authController.resetPassword);
router
  .route("/changePassword/:id")
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
