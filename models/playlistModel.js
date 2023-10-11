const mongoose = require("mongoose");
const Joi = require("joi");
const objectId = mongoose.Schema.Types.ObjectId;
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: objectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  songs: { type: Array, default: [] },
  img: {
    type: String,
  },
  //   createdBy: {
  //     type: objectId,
  //     ref: "User",
  //     required: true,
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
});
const validate = (playlist) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    description: Joi.string().allow(""),
    songs: Joi.array().items(Joi.string()),
    img: Joi.string().allow(""),
  });
  return schema.validate(playlist);
};
const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = (Playlist, validate);
