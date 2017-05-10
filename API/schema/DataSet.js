/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('./Config');

/**
 * Design our "DataSet" schema.
 * Contain all information about a target DataSet (related to one OpenData) and give access to all Config which are related.
 */
var DataSet = new Schema({

    // Basic information of the OpenData
    name: String,
    description: String,
    theme: String,
    id: String,

    // Date of creation and of last update
    created_at: Date,
    updated_at: { type: Date, default: Date.now },

    // OpenData parent name
    target_opendata: String,

    // Url component of this dataset
    ext_api_url_dataset_componant: String,

    // List of related Configs
    configs: [{ type: Schema.Types.ObjectId, ref: 'config' }]
});

module.exports = DataSet;