/**
 * Created by Benoit on 17/05/2017.
 */

'use strict';

var OpenData = require('../models/OpenData');
var DataSet = require('../models/DataSet');
var Config = require('../models/Config');


var Dialer = {
    req: null,
    meta: [],
    errorStack: [],

    /**
     * Setter of req.
     * Waiting for a "parsed request" object.
     *
     * @param parsedRequest
     * @return {number}
     */
    setRequest: function (parsedRequest) {
        if (parsedRequest == undefined || parsedRequest == null) {
            this.errorStack.push("[ERROR][DIALER][SET REQUEST] #parsedRequest# was either null or undefined.");
            return -1;
        }
        this.req = parsedRequest;
        return 0;
    },

    /**
     * Call catchOpenData for each instance of 'opendata' selected (#this.req[]#).
     * Return a Promise
     * Reject if request to DB failed someway or initial data are invalid. Resolve when value request to DB succeed.
     *
     * @return {Promise}
     */
    run: function () {
        var req = this.req;
        return new Promise(function (resolve, reject) {
            if (req == undefined || req == null) {
                this.errorStack.push("[ERROR][DIALER][RUN] #req# was either null or undefined.");
                return reject(-1);
            }
            var promises = [];
            var index, len;
            for (index = 0, len = req.length; index < len; ++index) {
                promises.push(Dialer.catchOpenData(req[index]));
            }

            Promise.all(promises).then(function (values) {
                console.log("[STATUS][DIALER][RUN] Succeed to fletch data to DB.");
                for (var i = 0, len = values.length; i < len; ++i) {
                    Dialer.meta.push(values[i]);
                }
                return resolve();
            }).catch(function(values) {
                console.log("[STATUS][DIALER][RUN] Failed to fletch data to DB.");
                return reject(values);
            });
        });
    },

    /**
     * Request data related to targeted (#opendata#) 'opendata' to DB and call catchDataSet for each instance of 'dataset' selected (#dskeys#).
     * Return a Promise
     * Reject if request to DB failed someway or initial data are invalid. Resolve when value request to DB succeed.
     *
     * @param opendata
     * @return {Promise}
     */
    catchOpenData: function (opendata) {
        return new Promise(function (resolve, reject) {
            if (opendata == undefined || opendata == null) {
                this.errorStack.push("[ERROR][DIALER][FILL META] #obj# was either null or undefined.");
                return reject(-1);
            }
            var odkeys, dskeys;
            odkeys = Object.keys(opendata);
            if (odkeys.length <= 0) {
                this.errorStack.push("[ERROR][DIALER][FILL META] #odkeys.length# should be > 0.");
                return reject(-2);
            }
            dskeys = Object.keys(opendata[odkeys[0]]);

            console.log(odkeys);
            console.log(dskeys);

            OpenData.find({ id: odkeys[0] }).exec(function(err, res_o) {
                if (err) {
                    console.log("ERROR :" + err);
                    return reject(-3);
                }
                if (res_o.length > 0) {
                    var name = res_o[0].name;
                    var promises = [];
                    var meta = {
                        name                            : name,
                        id                              : res_o[0].id,
                        updated_at                      : res_o[0].updated_at,
                        oddapi_compatible               : res_o[0].oddapi_compatible,
                        oddapi_compatible_since         : res_o[0].oddapi_compatible_since,
                        oddapi_version_compatible_since : res_o[0].oddapi_version_compatible_since,
                        oddapi_version_compatible       : res_o[0].oddapi_version_compatible,
                        oddapi_compatibility            : res_o[0].oddapi_compatibility,
                        ext_api_url                     : res_o[0].ext_api_url,
                        datasets                        : []
                    };

                    for (var index = 0; index < dskeys.length ; ++index) {
                        promises.push(Dialer.catchDataSet(name, dskeys[index]));
                    }

                    Promise.all(promises).then(function (values) {
                        for (var i = 0, len = values.length; i < len; ++i) {
                            if (values[i] != "None")
                                meta.datasets.push(values[i]);
                        }
                        return resolve(meta);
                    }).catch(function (values) {
                        return reject(values);
                    });
                }
            });
        });
    },

    /**
     * Request data related to targeted (#dataset#) 'dataset' to DB, populated to each of its 'config'.
     *
     * @param name
     * @param dataset
     * @return {Promise}
     */
    catchDataSet: function (name, dataset) {
        return new Promise(function (resolve, reject) {
            DataSet.find({ target_opendata: name, id: dataset }).populate({path: 'configs', model: Config}).exec(function (err, res_d) {
                if (err) {
                    console.log(err);
                    return reject(-1)
                }
                if (res_d.length > 0) {
                    var tmp = {
                        name                            : res_d[0].name,
                        id                              : res_d[0].id,
                        updated_at                      : res_d[0].updated_at,
                        ext_api_url_dataset_componant   : res_d[0].ext_api_url_dataset_componant,
                        configs                         : res_d[0].configs
                    };
                    return resolve(tmp);
                } else {
                    Dialer.errorStack.push("[ERROR][DIALER][FILL META] Cannot find dataset of id [" + dataset + "].");
                    console.log("[ERROR][DIALER][FILL META] Cannot find dataset of id [" + dataset + "].");
                    return resolve("None");
                }
            });
        });
    }
};

module.exports = Dialer;
