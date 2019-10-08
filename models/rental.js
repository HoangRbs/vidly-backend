const Joi = require('joi');
const mongoose = require('mongoose');

const RentalModel = mongoose.model('rentals collection',new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({    //purpose: custom type with more smaller properties
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie:{
        type: new mongoose.Schema({   //purpose: custom type with more smaller properties
            title:{
                type: String,
                required: true,
                minlength: 5,
                maxlength: 40,
                trim: true
            },
            dailyRentalRate:{
                type: Number,
                required: true,
                min: 0,
                max:200
            }
        }),
        required: true
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
}));

function validateSentRental(rental) {
    const joiSchema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    result = Joi.validate(rental,joiSchema);
    return result;
}

module.exports = {
    RentalModel,
    validateSentRental
}