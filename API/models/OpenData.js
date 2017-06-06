/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var opendataSchema = require('../schema/OpenData');

var OpenData = mongoose.model('opendata', opendataSchema);

// console.log('Fletch OpenData models');

module.exports = OpenData;