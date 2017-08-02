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

    /*
    ** Note : is_uri and is_path should be always of opposite state [(is_uri != is_path) == true]
    */
    // Define if this config element is used for build the user request
    is_uri: Boolean,
    // Define if this config element is used for parsing the element from raw data
    is_path: Boolean,

    // Name of the element ('name', 'position', 'rows') [target ObjectID into raw object]
    name: String,

    // Define the result format (JSON, CVS...)
    format: String,

    // State of accessibility through an external API
    api_accessible: Boolean,

    // Target file url (if any)
    file_uri: String,

    // Path obj : Will contain all information needed for extract data through an access (response ext API or read of target file)
    // OR path uri :  Will contain the uri part need to request the corresponding filtering element
    data: [],

    // DataSet parent name
    target_dataset: String
});

module.exports = Config;