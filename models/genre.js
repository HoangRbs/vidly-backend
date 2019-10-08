const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const GenreModel = mongoose.model('Genres Collection', genreSchema);

function validateSentGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = {
  GenreModel: GenreModel,
  validateSentGenre: validateSentGenre,
  genreSchema: genreSchema
}