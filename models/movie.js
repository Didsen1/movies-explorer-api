const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const { URL_REGEX } = require('../utils/other');

const movieSchema = new Schema(
  {
    country: {
      required: true,
      type: String,
    },

    director: {
      required: true,
      type: String,
    },

    duration: {
      required: true,
      type: Number,
    },

    year: {
      required: true,
      type: String,
    },

    description: {
      required: true,
      type: String,
    },

    image: {
      required: true,
      type: String,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется ввести URL',
      },
    },

    trailerLink: {
      required: true,
      type: String,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется ввести URL',
      },
    },

    thumbnail: {
      required: true,
      type: String,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется ввести URL',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },

    nameRU: {
      required: true,
      type: String,
    },

    nameEN: {
      required: true,
      type: String,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
