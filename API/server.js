/**
 * Created by Benoit on 09/05/2017.
 */

/**
 * Define all the dependencies of the API (using Express feature 'require')
 */
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

/**
 * Pre-parsing and treatment ("pre-"middleware)
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', ip);
    next();
});
/**
 * Mongoose (MongoDB solution) initialization and connection
 */
var mongooseOptions = {
    server: {
        reconnectTries: Number.MAX_VALUE
    },
    user: "PublicUser",
    pass: "Publ1c@cce22"
};

mongoose.connect('mongodb://localhost/openData', mongooseOptions, function (error) {
    if (error !== undefined)
        console.log('mongoose.connect failed. ' + error);
    else
        console.log('mongoose.connect succeed. Error : ' + error + '.');
});

/**
 * Request handlers (middleware)
 */
var routes = require('./middleware/routes');
routes(app);

/**
 * Start server listening
 */
app.listen(port);

console.log('The API is currently is listening on port : ' + port);
