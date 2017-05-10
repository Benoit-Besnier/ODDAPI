/**
 * Created by Benoit on 10/05/2017.
 */

'use strict';

/**
 * This module will contain all logic related to the "opendata" routes.
 *
 * @param app
 */
module.exports = function (app) {

    app.get('/opendata', function (req, res) {
        var RequestParser = require('../tools/RequestParser');
        var Dialer = require('../tools/Dialer');

        /**
         * Parsing client request
         */
        RequestParser.setRawReq(req.query);
        RequestParser.parseRawReq();

        /**
         * Request configuration from database
         */
        Dialer.setRequest(RequestParser.getReq());
        Dialer.run()
            .then(function () {
            console.log("S" + JSON.stringify(Dialer.meta, null, 2));
        })
            .catch(function (values) {
            console.log("F" + JSON.stringify(values, null, 2));
        });

        /**
         * Request & Response Stacks
         */

        /**
         * Response parsing & management
         */


        res.status(200).send(RequestParser.getReq());
    });

};