/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Design our "DataSet" schema.
 * Contain all information about a target Config (related to one OpenData, Theme and Config).
 */
var Config = new Schema({

    // Define the result format (JSON, CVS...)
    format: String,

    // State of accessibility through an external API
    api_accessible: Boolean,

    // Target file url (if any)
    file_url: String,

    // Path obj : Will contain all information needed for extract data through an access (response ext API or read of target file)
    path: {},

    // DataSet parent name
    target_dataset: String
});

module.exports = Config;