/**
 * Created by Benoit on 09/05/2017.
 */
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);

console.log('The API is currently is listening on port : ' + port);
