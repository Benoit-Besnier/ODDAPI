/**
 * Created by Benoit on 06/06/2017.
 */

'use strict';

var Request = require('request');

var RequestManager = {
    req: null,
    meta: null,
    errorStack: [],
    req_stack: [],
    res_stack: [],


    /**
     * Setter of #req# and #db_data#.
     * Waiting for a "parsed request" object and a "DB info" object.
     *
     * @param ParsedReq
     * @param Meta
     * @return {number}
     */
    init: function (ParsedReq, Meta) {
        if (ParsedReq == undefined || ParsedReq == null) {
            this.errorStack.push("[ERROR][REQUEST MANAGER][INIT] #ParsedReq# was either null or undefined.");
            console.log("[ERROR][REQUEST MANAGER][INIT] #ParsedReq# was either null, undefined.");
            return -1;
        }
        if (Meta == undefined || Meta == null || Meta.length <= 0) {
            this.errorStack.push("[ERROR][REQUEST MANAGER][INIT] #Meta# was either null, undefined or of length <= 0.");
            console.log("[ERROR][REQUEST MANAGER][INIT] #Meta# was either null, undefined or of length <= 0.");
            return -1;
        }
        this.req = ParsedReq;
        this.meta = Meta;
        return 0;
    },

    /**
     * Call reqBuilder then call requester.
     * Return a Promise
     * Reject if requester failed someway or initial data are invalid. Resolve when value requester succeed.
     *
     * @return {Promise}
     */
    run: function () {
        return new Promise(function (resolve, reject) {
            if (RequestManager.req == undefined || RequestManager.req == null) {
                RequestManager.errorStack.push("[ERROR][REQUEST MANAGER][RUN] #this.req# was either null or undefined.");
                console.log("[ERROR][REQUEST MANAGER][RUN] #this.req# was either null, undefined.");
                return -1;
            }
            if (RequestManager.meta == undefined || RequestManager.meta == null || RequestManager.meta.length <= 0) {
                RequestManager.errorStack.push("[ERROR][REQUEST MANAGER][RUN] #this.meta# was either null, undefined or of length <= 0.");
                console.log("[ERROR][REQUEST MANAGER][RUN] #this.meta# was either null, undefined or of length <= 0.");
                return -1;
            }
            RequestManager.reqBuilder();
            RequestManager.requester(RequestManager.req_stack)
                .then(function () {
                    return resolve();
                })
                .catch(function () {
                    console.log("CATCH ERROR INTO [RUN]");
                    return reject();
                });
        });
    },

    /**
     * Parse user request (#this.req#) and build URI by concatenation of element found into meta data (#this.meta#)
     */
    reqBuilder: function () {
        if (this.req == undefined || this.req == null) {
            this.errorStack.push("[ERROR][REQUEST MANAGER][REQ BUILDER] #this.req# was either null or undefined.");
            console.log("[ERROR][REQUEST MANAGER][REQ BUILDER] #this.req# was either null, undefined.");
            return -1;
        }
        if (this.meta == undefined || this.meta == null || this.meta.length <= 0) {
            this.errorStack.push("[ERROR][REQUEST MANAGER][REQ BUILDER] #this.meta# was either null, undefined or of length <= 0.");
            console.log("[ERROR][REQUEST MANAGER][REQ BUILDER] #this.meta# was either null, undefined or of length <= 0.");
            return -1;
        }
        var odkeys, dskeys;
        var o_index, o_len, d_index, d_len;
        var i, l, j, m;

        for (o_index = 0, o_len = this.req.length; o_index < o_len; ++o_index) {
            odkeys = Object.keys(this.req[o_index]);
            for (i = 0, l = this.meta.length; i < l; ++i) {
                if (this.meta[i].id == odkeys[0]) {
                    dskeys = Object.keys(this.req[o_index][odkeys[0]]);
                    for (d_index = 0, d_len = dskeys.length; d_index < d_len; ++d_index) {
                        for (j = 0, m = this.meta[i].datasets.length; j < m; ++j) {
                            if (this.meta[i].datasets[j].id == dskeys[d_index]) {
                                var uri = this.meta[i].ext_api_url + this.meta[i].datasets[j].ext_api_url_dataset_componant;
                                var set = {
                                    opendata    : odkeys[0],
                                    dataset     : dskeys[d_index],
                                    uri         : uri
                                };
                                this.req_stack.push(set);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    },

    /**
     * Get a list of item (URI with some data) and for each item, make a request while using the uri.
     * Return a promise
     * Resolve if request() as been resolved successfully. Reject when some amiss has been found (Error, Execution failed...).
     *
     * @param req_stack
     * @return {Promise}
     */
    requester: function (req_stack) {
        return new Promise(function (resolve, reject) {
            if (req_stack == undefined || req_stack == null || req_stack.length <= 0) {
                RequestManager.errorStack.push("[ERROR][REQUEST MANAGER][REQUESTER] #this.req_stack# was either null, undefined or of length <= 0.");
                console.log("[ERROR][REQUEST MANAGER][REQUESTER] #this.req_stack# was either null, undefined or of length <= 0.");
                return -1;
            }
            var index, len;
            var promises = [];

            for (index = 0, len = req_stack.length; index < len; ++index) {
                var item = req_stack[index];
                promises.push(RequestManager.request(item));
            }

            Promise.all(promises)
                .then(function (values) {
                    var index, len;
                    for (index = 0, len = values.length; index < len; ++index) {
                        RequestManager.res_stack.push(values[index]);
                    }
                    return resolve();
                })
                .catch(function () {
                    console.log("CATCH ERROR INTO [REQUESTER]");
                    return reject();
                });
        });
    },

    /**
     * Make a request using item.uri.
     * Return a promise
     * Resolve if the request as been resolved successfully. Reject if request response isn't what was expected (Code 500, body == null...)
     *
     * @param item
     * @return {Promise}
     */
    request: function (item) {
        return new Promise(function (resolve, reject) {
            Request(item.uri, function (error, response, body) {
                if (error) {
                    RequestManager.errorStack.push("[ERROR][REQUEST MANAGER][REQUEST]<Request Err>" + error);
                    console.log("[ERROR][REQUEST MANAGER][REQUEST]<Request Err>" + error);
                    return reject();
                } else {
                    var set = {
                        opendata    : item.opendata,
                        dataset     : item.dataset,
                        res         : JSON.parse(body)
                    };
                    return resolve(set);
                }
            });
        });
    }
};

module.exports = RequestManager;