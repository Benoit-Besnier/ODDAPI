/**
 * Created by Benoit on 11/05/2017.
 */

'use strict';

module.exports = function (targets) {
    var index, len, path;
    var models = {};

    for (index = 0, len = targets.length; index < len; ++index) {
        path = '../models/' + targets[index];
        models[targets[index]] = require(path);
    }

    return models;
};