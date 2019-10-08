const jwt  = require('jsonwebtoken');
const config = require('config');

//ex: authorize : does logged in user provide his/her user token to have access to create genre
// or show his/her own info
module.exports = function(req,res,next){

    const userToken = req.header('userToken');  //user send his/her token in header
    if(!userToken) return res.status(401).send('err unAuthorize: no token provided');

    try{
        const userInfo = jwt.verify(userToken,config.get('jwtPrivateKey'));
        //userInfo(payload) = {userId , isAdmin}
        req.loggedInUser = userInfo;
        next();
    }
    catch(err){
        res.status(400).send('err bad request: invalid token' + err);
    }
}