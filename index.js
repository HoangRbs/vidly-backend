const winston = require('winston');

const express = require('express');
const app = express();

require('./startUp/validation'); //set up joi validation tool
require('./startUp/config')();   //test config
require('./startUp/logging')();  //set up winston logging
require('./startUp/dbInit')();   //set up db
require('./startUp/appUse')(app); //routes and middleware
require('./startUp/security')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;