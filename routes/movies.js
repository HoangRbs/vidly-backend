const express = require('express');
const moviesRoute = express.Router();
const {MovieModel,validateSentMovie} = require('../models/movie');
const {GenreModel} = require('../models/genre');

moviesRoute.get('/',async (req,res) => {
    const allMovies = await MovieModel.find().sort('title');
    res.send(allMovies);
});

moviesRoute.post('/create',async (req,res) => {
    const result = validateSentMovie(req.body);  //TEST THIS
    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    
    //find genre inside genres collection
    try{
        const genre = await GenreModel.findById(req.body.genreId);
        const newMovie = new MovieModel({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
    
        await newMovie.save();
    
        res.send(newMovie);
    }
    catch(err){
        res.status(400).send(err);
    }
});

module.exports = moviesRoute;