/**
 * Created by Benoit on 10/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Theme = require('./DataSet');

/**
 * Design our "OpenData" schema.
 * Contain all information about a target OpenData and give access to all Theme -> DataSet -> Config which are related.
 */
var OpenData = new Schema ({

    // Basic information of the OpenData
    name: String,
    provider: String,
    description: String,
    press_url: String,
    id: {type: String, index: {unique: true}},

    // Date of creation and of last update
    created_at: Date,
    updated_at: { type: Date, default: Date.now },

    // Information about compatibility with our API
    oddapi_compatible: Boolean,
    oddapi_compatible_since : Date,
    oddapi_version_compatible_since : String,
    oddapi_version_compatible: String,
    oddapi_compatibility : { type : Number, min: 0, max: 100 },

    // Tags for theme and dataset search (related to THIS OpenData)
    theme_tags: [String],
    dataset_tags: [String],

    // Config url (target url if our API need to fletch information from another API)
    ext_api_url: String,

    // List of related themes
    datasets: [{ type: Schema.Types.ObjectId, ref: 'dataset' }]
});

module.exports = OpenData;

