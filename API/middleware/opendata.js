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
        var Communicator = require('../tools/Communicator');
        var RequestManager = require('../tools/RequestManager');

        /**
         * Parsing client request
         */
        RequestParser.setRawReq(req.query);
        RequestParser.parseRawReq();

        /**
         * Request configuration from database
         */
        Communicator.setRequest(RequestParser.getReq());
        Communicator.run()
            /**
             * Request & Response Stacks
             */
            .then(function () {
                console.log("Communicator.run() ended successfully. Keep processing...");
                RequestManager.init(Communicator.req, Communicator.meta);
                RequestManager.run()
                    /**
                     * Response parsing & management
                     */
                    .then(function () {
                        console.log('RequestManager.run() ended successfully. Keep processing...');
                        // console.log(JSON.stringify(RequestManager.res_stack, null, 2));

                    })
                    .catch(function () {
                        console.log('Request.manager() ended unsuccessfully. REQ Aborted.');
                    });
            })
            .catch(function (values) {
                console.log("Communicator.run() ended unsuccessfully. REQ Aborted.");
            });





        res.status(200).send(RequestParser.getReq());
    });

};