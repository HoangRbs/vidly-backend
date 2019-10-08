const mongoose = require('mongoose');
const {UserModel} = require('../../../models/user');
const authorize_Mid = require('../../../middleware/authorize');

describe('authorize middleware',() => {
    it('the req.loggedInUser should equal to the provided userInfo of valid JWT',() => {
        const userInfo = {
            _id: mongoose.Types.ObjectId(),
            isAdmin: true
        };

        //temp
        const userInfo2 = {
            userId: userInfo._id.toHexString(),
            isAdmin: true
        }

        const token = new UserModel(userInfo).generateAuthenToken()
        
        let req = {
            header: function(){
                return token;
            }
        };

        let res = {};

        function next(){/*...*/};

        authorize_Mid(req,res,next);
        expect(req.loggedInUser).toMatchObject(userInfo2);
    })
})