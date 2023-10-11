const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

router.use("/:songID/songReviews", reviewRouter);
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "artist", "user"),
    songsController.getAllSongs
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "artist", "user"),
    songsController.addSong
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "artist", "user"),
    songsController.songByID
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "artist", "user"),
    songsController.updateSong
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "artist", "user"),
    songsController.deleteSong
  );

router
  .route("/artist/:artist")
  .get(authController.protect, songsController.getSongByArtist);

router.route("/name/:name").get(songsController.getSongByName);

router
  .route("/likes/:id")
  .put(authController.protect, songsController.likeSong);

module.exports = router;
