module.exports = function(req,res,next){
    
    if(!req.loggedInUser.isAdmin) return res.status(403).send('err forbidden : ' + 'access denied');

    next();
}