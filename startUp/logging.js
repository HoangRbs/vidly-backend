const winston = require('winston');
//require('winston-mongodb');

module.exports = function() {

    winston.add(winston.transports.File, {filename: 'logFile.log'});
    winston.add(winston.transports.Console, { name:'clgt' , colorize: true, prettyPrint: true});
    /*
    winston.add(winston.transports.MongoDB, 
        { db: 'mongodb://localhost/vidly' ,
            level: 'info'
        });
    */

    //this only works with sync code
    process.on('uncaughtException', (exception) => {
        winston.error(exception);
        process.exit(1);
    });
  
    //working with async code (unhandled promise)
    process.on('unhandledRejection', (rej)=>{
        winston.error(rej);
        process.exit(1);
    });
    
    //uncaught exception (not inside express Route)
    //throw new Error('ERROR AT THE START OF SERVER');
    
    //unhandled promise
    /*
    Promise.reject('SOME PROMISE FAIL')
        .then(() => {})
    */
}