
const {genreSchema,GenreModel,validateSentGenre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const genreRoute = express.Router();

//middleware function()
const authorize_mid = require('../middleware/authorize');
const isAdmin_mid = require('../middleware/isAdmin');
const validateObjectId = require('../middleware/validateObjectId');
const TryCatch_Mid = require('../middleware/TryCatch');  
//add a try catch between
// surrounded code and next() to 
// error handing (Mid) if there's an error occurs
                                                         
genreRoute.get('/', TryCatch_Mid(async (req,res) => {
  //throw new Error('could not get the genres');
  const genres = await GenreModel.find().sort('name');
  if(genres)
    res.send(genres);
  //else
    //res.send(`there's not a genres collection in vidly_test db yet`);
}));

genreRoute.post('/create/',authorize_mid ,async (req, res) => {
  const { error } = validateSentGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new GenreModel({ name: req.body.name });

  try{
    genre = await genre.save();
  }
  catch(err){
    res.status(400).send(err);
  }
  
  res.send(genre);
});

genreRoute.put('/findAndUpdate/:id', async (req, res) => {
  const { error } = validateSentGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

genreRoute.delete('/delete/:id',[authorize_mid,isAdmin_mid],async (req, res) => {
  const genre = await GenreModel.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

genreRoute.get('/find/:id', validateObjectId ,TryCatch_Mid(async (req, res) => {
  
  const genre = await GenreModel.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
}));

module.exports = genreRoute;
