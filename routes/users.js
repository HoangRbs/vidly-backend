const mongoose = require('mongoose');
const express = require('express');
const {UserModel,validateSentUser} = require('../models/user');
const userRoute = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const authorize = require('../middleware/authorize');
const Joi = require('joi');

userRoute.get('/me',authorize,async (req,res,) => {
    const user = await UserModel.findById(req.loggedInUser.userId).select('-password');
    res.send(user);
});

userRoute.post('/register', async (req, res) => {
    const {error} = validateSentUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const existUser = await UserModel.findOne({ email: req.body.email})
    if(existUser) return res.status(400).send('user already exist');

    const newUser  = new UserModel(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password,salt);
    await newUser.save();

    //create USER TOKEN
    const token = newUser.generateAuthenToken();
    res.header('userToken',token).send(_.pick(newUser,['_id','name','email']));
});

userRoute.post('/login', async (req, res) => {
    const {error} = validateSentLogInUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const existUser = await UserModel.findOne({ email: req.body.email})
    if(!existUser) return res.status(400).send('invalid email');

    const isValidPassword = await bcrypt.compare(req.body.password,existUser.password);
    if(!isValidPassword) return res.status(400).send('invalid password');

    //create USER TOKEN
    const token = existUser.generateAuthenToken();
    res.header('userToken',token).send('succesfully loggin : ');
});

function validateSentLogInUser(sentUser){
    const joiSchema = {
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    }

    return Joi.validate(sentUser,joiSchema);
}

module.exports = userRoute;