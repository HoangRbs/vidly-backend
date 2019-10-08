const config = require('config');

module.exports = function(){
    //test config or end point will not work correctly
    if(!config.get('jwtPrivateKey')){      //if jwtPrivateKey is not SET
        throw new Error('ERROR vidly_jwtPrivateKey is not SET');
    }
}