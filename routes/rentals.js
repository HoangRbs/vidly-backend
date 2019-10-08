const express = require('express');
const RentalRoute = express.Router();
const mongoose = require('mongoose');
const {RentalModel,validateSentRental} = require('../models/rental');
const {CustomerModel} = require('../models/customer');
const {MovieModel} = require('../models/movie');
const fawn = require('fawn');

fawn.init(mongoose);

RentalRoute.get('/',async (req,res) => {
    const rentals = await RentalModel.find().sort('-dateOut');
    res.send(rentals);
});

RentalRoute.post('/create', async(req,res) => {
    const {error} = validateSentRental(req.body);  //TEST THIS
    if(error) return res.status(400).send(error.details[0].message);
    
    //find customer
    const customer = await CustomerModel.findById(req.body.customerId);
    if(!customer) return res.status(400).send('invalid customer'); 

    //find movie
    const movie = await MovieModel.findById(req.body.movieId);
    if(!movie) return res.status(400).send('invalid movie');

    if(movie.numberInStock === 0) return res.status(400).send('movie not in stock');

    //create new rental
    const rental = new RentalModel({
        customer: new CustomerModel({       //FIX THIS LATER WITH COMPLEX OBJECT
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        }),
        movie: new MovieModel({
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        })
    });

    //await rental.save();
    
    //movie.numberInStock--;
    //movie.save();

    //res.send(rental);
    try{
        const task = new fawn.Task();
        task.save(RentalModel,rental)
        .update("movies collections",{_id: movie._id},{$inc: { numberInStock: -1 }})
        .run()
    
        res.send(rental);
    }
    catch(exception){
        res.status(500).send('internal sever err');
    }
});

module.exports = RentalRoute;