const {UserModel} = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('testing user.generateAuthToken',()=>{
    it(' should return a valid user token',() => {
        let payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const testUser = new UserModel(payload);
        const token = testUser.generateAuthenToken();
        const decodedInfo =  jwt.verify(token,config.get('jwtPrivateKey'));
        payload = { 
            userId: payload._id, 
            isAdmin: payload.isAdmin
        } 
        expect(decodedInfo).toMatchObject(payload);
    })
});