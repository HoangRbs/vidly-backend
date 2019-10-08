module.exports = function (handler){
    return async(req,res,next) => {   //function calls -> return another (middleware) function DEFINITION
      try{
        await handler(req,res);
      }
      catch(err){
        next(err);  //next(err) to error handling middleware function
      }
    }
}