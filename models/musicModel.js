const mongoose = require("mongoose"); //? mongoose
const Joi = require("joi"); //? joi
//create a schema for the DB

const musicSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "A Music must have a name"],
      type: String,
      trim: true, //remove all the white spaces in the beginning and the end
    },

    artist: {
      required: [true, "A Music must have a artist"],
      type: String,
      trim: true, //remove all the white spaces in the beginning and the end
    },
    song: {
      type: String,
      required: [true, "A music must have a song"],
    },
    duration: {
      type: Number,
      required: [true, "A music must have a time"],
    },
    img: {
      type: String,
      required: [true, "A music must have a image"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// joi  validate the data before saving it to the DB
const validate = (song) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    artist: Joi.string().required(),
    song: Joi.string().required(),
    duration: Joi.number().required(),
    img: Joi.string().required(),
  });
  return schema.validate(song);
};

//create a model inside the schema of ane DB
const Music = mongoose.model("Musics", musicSchema); //? mongoose.model

// musicSchema.virtual("reviews", {
//   ref: "Review", //review model
//   foreignField: "tour", //foreign key in review model
//   localField: "_id", //local key in tour model
// });

// module.exports = (Music, validate); //? export the model
module.exports = Music; //? export the model
