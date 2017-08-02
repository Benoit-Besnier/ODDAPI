/**
 * Created by Benoit on 27/07/2017.
 */

'use strict';

/**
 * RESPONSE BUILDER
 * This object will take meta data from our DB, result from RequestManager and options from RequestParser.
 * When running, will check if user wish for formated data or not, aggragated data or not... and constrcut a response
 * which will be send to the user afterward.
 *
 *
 * @type {{meta: null, res: null, options: null, errorStack: Array, init: ResponseBuilder.init, run: ResponseBuilder.run}}
 */
var ResponseBuilder = {
    meta: null,
    res: null,
    options: null,
    errorStack : [],
    valid: [],

    /**
     * Setter of #meta#, #req# and #options#
     * Waiting for "meta" data from Communicator, "res" data from RequestManager and "options" data from RequestParser
     *
     * @param Meta
     * @param Res
     * @param Options
     * @return {number}
     */
    init: function (Meta, Res, Options) {
        if (Meta == undefined || Meta == null) {
            this.errorStack.push("[ERROR][RESPONSE BUILDER][INIT] #Meta# was either null or undefined.");
            console.log("[ERROR][RESPONSE BUILDER][INIT] #Meta# was either null, undefined.");
            return -1;
        }
        if (Res == undefined || Res == null) {
            this.errorStack.push("[ERROR][RESPONSE BUILDER][INIT] #Res# was either null or undefined.");
            console.log("[ERROR][RESPONSE BUILDER][INIT] #Res# was either null, undefined.");
            return -1;
        }
        if (Options == undefined || Options == null) {
            this.errorStack.push("[ERROR][RESPONSE BUILDER][INIT] #Options# was either null or undefined.");
            console.log("[ERROR][RESPONSE BUILDER][INIT] #Options# was either null, undefined.");
            return -1;
        }
        this.meta = Meta;
        this.res = Res;
        this.options = Options;
        return 0;
    },

    /**
     * Depending of options, set opendata raw response or a formatted version of those information.
     * Return a Promise.
     * Will reject if something is amiss or failed, resolve if everything succeed.
     *
     * @return {Promise}
     */
    run: function () {
        return new Promise(function (resolve, reject) {
            if (ResponseBuilder.meta == undefined || ResponseBuilder.meta == null) {
                ResponseBuilder.errorStack.push("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.meta# was either null or undefined.");
                console.log("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.meta# was either null or undefined.");
                return reject(-1);
            }
            if (ResponseBuilder.res == undefined || ResponseBuilder.res == null) {
                ResponseBuilder.errorStack.push("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.res# was either null or undefined.");
                console.log("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.res# was either null or undefined.");
                return reject(-1);
            }
            if (ResponseBuilder.options == undefined || ResponseBuilder.options == null) {
                ResponseBuilder.errorStack.push("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.options# was either null or undefined.");
                console.log("[ERROR][RESPONSE BUILDER][RUN] #ResponseBuilder.options# was either null or undefined.");
                return reject(-1);
            }

            if (ResponseBuilder.options.rawRes) {
                ResponseBuilder.valid = ResponseBuilder.res;
                console.log("[STATUS][RESPONSE BUILDER][RUN] User has selected the \"raw_response\" option.");
                return resolve(0);
            }
            if (ResponseBuilder.format() == -1)
                return reject(-1);
            return resolve(0);
        });
    },

    /**
     * First iteration parsing level.
     * Will trigger getConf(), buildFilter() and parseRes() in order to format data for each opendata raw(s) response(s).
     * May failed if #res# and/or meta aren't correctly set.
     *
     * @return {number}
     */
    format: function () {
        if (this.meta == undefined || this.res == undefined || this.options == undefined) {
            this.errorStack.push("[ERROR][RESPONSE BUILDER][FORMAT] #this.meta/res/options# was/were undefined.");
            console.log("[ERROR][RESPONSE BUILDER][FORMAT] #this.meta/res/options# was/were undefined.");
            return -1;
        }
        if (this.meta == null || this.res == null || this.options == null) {
            this.errorStack.push("[ERROR][RESPONSE BUILDER][FORMAT] #this.meta/res/options# was/were undefined.");
            console.log("[ERROR][RESPONSE BUILDER][FORMAT] #this.meta/res/options# was/were undefined.");
            return -1;
        }

        // console.log(this.meta);
        // console.log(JSON.stringify(this.res, null, 2));
        var i, l;

        for (i = 0, l = this.res.length; i < l; ++i) {
            var conf = this.getConf(this.res[i], this.meta);
            var filter = this.buildFilter(conf);
            var parsed = this.parseRes(filter, this.res[i]);
            // console.log(JSON.stringify(parsed, null, 2));
            // console.log(this.res[i]);
            this.valid.push({
                opendata: this.res[i].opendata,
                dataset: this.res[i].dataset,
                result: parsed
            });
        }
    },

    /**
     * Will extract every useful configuration (depend of opendata/dataset/users selected items).
     * Return a array of configuration.
     *
     * @param item
     * @param meta
     * @return {Array}
     */
    getConf: function (item, meta) {
        var t_opendata, t_dataset, t_configs = [];
        var i, l, j, s;
        var tmp;

        for (i = 0, l = meta.length; i < l; ++i) {
            if (meta[i].id = item.opendata) {
                t_opendata = meta[i];
                for (j = 0, s = t_opendata.datasets.length; j < s; ++j) {
                    if (t_opendata.datasets[j].id == item.dataset) {
                        t_dataset = t_opendata.datasets[j];
                        break;
                    }
                }
                break;
            }
        }

        tmp = t_dataset.target_data;
        for (i = 0, l = tmp.item.length; i < l; ++i) {
            for (j = 0, s = t_dataset.configs.length; j < s; ++j) {
                if (t_dataset.configs[j].is_path && t_dataset.configs[j].format == tmp.format
                    && t_dataset.configs[j].name == tmp.item[i]) {
                    t_configs.push(t_dataset.configs[j]);
                }
            }
        }
        return t_configs;
    },

    /**
     * Transform our array of configuration into a more simple tuple.
     * Return a array of tuple (which is our filter).
     *
     * @param conf
     * @return {Array}
     */
    buildFilter: function (conf) {
        var filter = [];
        var i, l, tmp;

        for (i = 0, l = conf.length; i < l; ++i) {
            tmp = {
                key: conf[i].name,
                path: conf[i].data
            };
            filter.push(tmp);
        }

        return filter;
    },

    /**
     * Second parsing iteration level.
     * Set the item #parsed# (our result) and call applyFilterOnRes() for each tuple into our current filter.
     *
     * @param filter
     * @param res
     * @return {{}}
     */
    parseRes: function (filter, res) {
        var i, l, parsed = {};

        for (i = 0, l = filter.length; i < l; ++i) {
            this.applyFilterOnRes(filter[i], res, parsed);
        }

        return parsed;
    },

    /**
     * Third parsing iteration level.
     * Fill #parsed# (upper ref) if there aren't any |#ODDAPI#<<array_loop>>#ODDAPI#| (may call it the array_loop signature),
     * may call arrayLoop() if the array_loop signature is found.
     *
     * @param filter
     * @param res
     * @param parsed
     */
    applyFilterOnRes: function (filter, res, parsed) {
        var i, l;
        var ptr = res.res;

        for (i = 0, l = filter.path.length; i < l; ++i) {

            if (filter.path[i] == "#ODDAPI#<<array_loop>>#ODDAPI#") {
                if (parsed.values == undefined || parsed.values == null)
                    parsed.values = [];
                this.arrayLoop(filter, i, ptr, parsed);
                break;
            }

            ptr = ptr[filter.path[i]];
            if (i == (l - 1))
                parsed[filter.key] = ptr;
        }
    },

    /**
     * Fourth parsing iteration level. (May happen when the array_loop signature has been found)
     * For each instance of the array, will apply our filter.
     * Set/update the #parsed# obj (or sub-items) (upper ref).
     *
     * @param filter
     * @param pos
     * @param res
     * @param parsed
     */
    arrayLoop: function (filter, pos, res, parsed) {
        var i, l, j, s;
        var ptr, tmp;

        for (j = 0, s = res.length; j < s; ++j) {
            ptr = res[j];

            for (i = (pos + 1), l = filter.path.length; i < l; ++i) {
                ptr = ptr[filter.path[i]];

                if (i == (l - 1)) {
                    if (s == parsed.values.length) {
                        tmp = parsed.values[j];
                        tmp[filter.key] = ptr;
                    } else {
                        tmp = {};
                        tmp[filter.key] = ptr;
                        parsed.values.push(tmp);
                    }
                }
            }
        }
    }

};

module.exports = ResponseBuilder;