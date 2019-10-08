const movieRoute = require('../routes/movies');
const rentalRoute = require('../routes/rentals');
const customerRoute = require('../routes/customers');
const genreRoute = require('../routes/genres');
const userRoute = require('../routes/users');
const errHandling = require('../middleware/errHandling');
const express = require('express');

module.exports = function(app){
    app.use(express.json());
    app.use('/api/genres', genreRoute);
    app.use('/api/customers', customerRoute);
    app.use('/api/movies',movieRoute);
    app.use('/api/rentals',rentalRoute);
    app.use('/api/users',userRoute);
    app.use(errHandling);
}