const Music = require("../models/musicModel");
const User = require("../models/userModel");
const factoryHandler = require("./factoryHandler");

exports.addSong = factoryHandler.createOne(Music);
exports.deleteSong = factoryHandler.deleteOne(Music);
exports.updateSong = factoryHandler.updateOne(Music);
exports.getAllSongs = factoryHandler.getAll(Music);
exports.songByID = factoryHandler.getOne(Music);
// exports.addSong = async (req, res) => {
//   try {
//     const newSong = await Music.create(req.body);
//     res.status(201).json({
//       status: "success",
//       data: {
//         book: newSong,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Error in creating a new song",
//     });
//   }
// };

// exports.getAllSongs = async (req, res) => {
//   try {
//     const songs = await Music.find();
//     res.status(200).json({
//       status: "success",
//       results: songs.length,
//       data: {
//         songs,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Cannot get all songs",
//     });
//   }
// };

// exports.songByID = async (req, res) => {
//   try {
//     const songByID = await Music.findById(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: {
//         songByID,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "This route is not yet defined",
//     });
//   }
// };
exports.songByTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const songByTitle = await Music.findOne({ title });
    res.status(200).json({
      status: "success",
      data: {
        songByTitle,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "This route is not yet defined",
    });
  }
};
exports.songByAuthour = async (req, res) => {
  try {
    const { author } = req.body;
    const songByAuthour = await Music.findOne({ author });
    res.status(200).json({
      status: "success",
      data: {
        songByAuthour,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "This route is not yet defined",
    });
  }
};
// exports.deleteSong = async (req, res) => {
//   try {
//     const songById = await Music.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: "success delete SONG",
//       data: {
//         songById,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "This route is not yet defined",
//     });
//   }
// };
// exports.updateSong = async (req, res) => {
//   try {
//     const updateSong = await Music.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, //return the new updated data
//       runValidators: true, //run the validator again
//     });
//     res.status(200).json({
//       status: "success update SONG",
//       data: {
//         updateSong,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "This route is not yet defined",
//     });
//   }
// };

exports.getSongByArtist = async (req, res) => {
  try {
    const { artist } = req.params.artist;
    const songByArtist = await Music.findOne({ artist });
    res.status(200).json({
      status: "success",
      data: {
        songByArtist,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Cannot get all songs",
    });
  }
};
exports.getSongByName = async (req, res) => {
  try {
    const { name } = req.params.name;
    const song = await Music.findOne({ name });
    res.status(200).json({
      status: "Song Fetched Success",
      song: song,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Cannot get song",
    });
  }
};
exports.likeSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Music.findById(songId);
    console.log(song);
    if (!song) {
      return res.status(404).json({
        status: "error",
        message: "No song found with that ID",
      });
    }
    const user = await User.findById(req.userx.id); // Assuming it's req.user.id, not req.userx.id

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with that ID",
      });
    }
    if (user.likedSongs.includes(song._id)) {
      return res.status(400).json({
        status: "error",
        message: "You already liked this song",
      });
    }
    await user.saveLikedSong(songId); // Use the saveLikedSong method
    res.status(200).json({
      status: "success",
      message: "Song liked successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error in liking song",
      error: err,
    });
  }
};

// exports.likeSong = async (req, res) => {
//   let resMessage = "";
//   const song = await Music.findById(req.params.id);

//   if (!song) return res.status(400).send({ message: "song does not exist" });

//   const user = await User.findById(req.userx.id);
//   const index = user.likedSongs.indexOf(song._id);
//   if (index === -1) {
//     user.likedSongs.push(song._id);
//     resMessage = "Added to your liked songs";
//   } else {
//     user.likedSongs.splice(index, 1);
//     resMessage = "Removed from your liked songs";
//   }

//   await user.save();
//   res.status(200).send({ message: resMessage });
// };

exports.unlikeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const song = await Music.findById(songId);
    if (!song) {
      return res.status(404).json({
        status: "error",
        message: "No song found with that ID",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with that ID",
      });
    }
    if (!user.likedSongs.includes(songId)) {
      return res.status(400).json({
        status: "error",
        message: "You already unliked this song",
      });
    }
    user.likedSongs.splice(user.likedSongs.indexOf(songId), 1);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Song unliked successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error in unliking song",
      error: err,
    });
  }
};
