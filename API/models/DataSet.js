/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var datasetSchema = require('../schema/DataSet');

var DataSet = mongoose.model('dataset', datasetSchema);

module.exports = DataSet;