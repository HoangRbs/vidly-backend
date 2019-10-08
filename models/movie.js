const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const MovieModel = mongoose.model('Movies Collection',new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 40,
        trim: true
    },
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        min:0,
        max:200
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max:200
    }
}));

//validate the movie info that user sends
function validateSentMovie(movie){
    const joiSchema = {
        title: Joi.string().min(5).max(40).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }

    return Joi.validate(movie,joiSchema);
}

module.exports = {
    MovieModel,
    validateSentMovie
}