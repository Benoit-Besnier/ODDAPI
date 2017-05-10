/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var configSchema = require('../schema/Config');

var Config = mongoose.model('config', configSchema);

module.exports = Config;