/**
 * Created by Benoit on 10/05/2017.
 */

'use strict';

module.exports = function (app) {


    var opendata = require('./opendata');

    /**
     * Catch 'http://xxx/opendata' GET request
     */
    opendata(app);

    /**
     * If user request is not correct, send error 404.
     */
    app.use(function(req, res){
        res.sendStatus(404);
    });
};