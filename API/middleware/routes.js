/**
 * Created by Benoit on 10/05/2017.
 */

'use strict';

module.exports = function (app) {

    /**
     * Catch 'http://xxx/unique' GET request
     */
    app.get('/unique', function (req, res) {
        res.status(200).send(req.query);
    });

    /**
     * Catch 'http://xxx/multiple' GET request
     */
    app.get('/multiple', function (req, res) {
        res.status(200).send(req.query);
    });

    /**
     * If user request is not correct, send error 404.
     */
    app.use(function(req, res){
        res.sendStatus(404);
    });
};