const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthenToken = function(){
  return jwt.sign({userId: this._id, isAdmin: this.isAdmin},config.get('jwtPrivateKey'))
}

const UserModel = mongoose.model('Users Collection', userSchema);

function validateSentUser(sentUser) {
  const joiSchema = {
    name: Joi.string().min(6).max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
  };

  return Joi.validate(sentUser, joiSchema);
}

exports.UserModel = UserModel; 
exports.validateSentUser = validateSentUser;