/**
 * Created by Benoit on 01/06/2017.
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Mongoose (MongoDB solution) initialization and connection
 */
var mongooseOptions = {
    server: {
        reconnectTries: Number.MAX_VALUE
    },
    auth: {
        authSource: 'opendata'
    },
    user: "PublicUser",
    pass: "Publ1c@cce22"
};


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection succeed. ');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

mongoose.ConnectionOptions = mongooseOptions;
mongoose.Promise = global.Promise;

module.exports = mongoose;
