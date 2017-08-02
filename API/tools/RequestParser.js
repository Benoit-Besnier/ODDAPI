/**
 * Created by Benoit on 17/05/2017.
 */

'use strict';

/**
 * REQUEST PARSER
 * This object will be use to parse succinctly request from user and make it more useful for us afterward.
 *
 * @type {{rawReq: null, Req: null, parsed: number, options: {aggregate: boolean, rawRes: boolean, customReq: boolean}, errorStack: Array, setRawReq: RequestParser.setRawReq, parseRawReq: RequestParser.parseRawReq, checkOptions: RequestParser.checkOptions, getReq: RequestParser.getReq, getOptions: RequestParser.getOptions, getCountParsed: RequestParser.getCountParsed, getErrorStack: RequestParser.getErrorStack}}
 */
var RequestParser = {
    rawReq: null,
    Req: null,
    parsed: -1,
    options: {
        aggregate: false,
        rawRes: false,
        customReq: false
    },
    errorStack: [],

    /**
     * Setter of RawReq.
     * Return -1 if userReq is null or undefined.
     *
     * @param userReq
     * @return {number}
     */
    setRawReq: function (userReq) {
        if (userReq == undefined || userReq == null) {
            this.errorStack.push("[ERROR][REQUEST PARSER][SET RAW REQUEST] #userReq# was either null or undefined.");
            console.log("[ERROR][REQUEST PARSER][SET RAW REQUEST] #userReq# was either null or undefined.");
            return -1;
        }
        this.rawReq = userReq;
        return 0;
    },

    /**
     * Parse the Raw req and divide options from the opendata information.
     * Return -1 if RawReq is null or undefined, or value >= 0 if successfully executed.
     *
     * @return {number}
     */
    parseRawReq: function () {
        if (this.rawReq == undefined || this.rawReq == null) {
            this.errorStack.push("[ERROR][REQUEST PARSER][PARSE RAW REQUEST] #rawReq# was either null or undefined.");
            console.log("[ERROR][REQUEST PARSER][PARSE RAW REQUEST] #rawReq# was either null or undefined.");
            return -1;
        }

        var index, len, keys;
        this.Req = [];

        keys = Object.keys(this.rawReq);

        for (index = 0, len = keys.length; index < len; ++index) {
            if (keys[index] == "options")
                this.checkOptions(this.rawReq[keys[index]]);
            else {
                var obj = {};
                obj[keys[index]] = this.rawReq[keys[index]];
                this.Req.push(obj);
            }
        }
        this.parsed = index;
        return index;
    },

    /**
     * Catch all "options" flags found into the user Req (saved into rawReq) and update our options obj.
     * Return -1 if options is null or undefined, or value >= 0 if successfully executed.
     *
     * @param options
     * @return {number}
     */
    checkOptions: function (options) {
        if (options == undefined || options == null) {
            this.errorStack.push("[ERROR][REQUEST PARSER][CHECK OPTIONS] #options# was either null or undefined.");
            console.log("[ERROR][REQUEST PARSER][CHECK OPTIONS] #options# was either null or undefined.");
            return -1;
        }

        var index, len;
        for (index = 0, len = options.length; index < len; ++index) {
            switch (options[index]) {
                case "aggregate":
                    this.options.aggregate = true;
                    break;
                case "raw_result":
                    this.options.rawRes = true;
                    break;
                case "custom_request":
                    this.options.customReq = true;
                    break;
                default:
                    this.errorStack.push("[ERROR][REQUEST PARSER][CHECK OPTIONS] Options <" + options[index] + "> may not be defined.");
                    break;
            }
        }
        return index;
    },

    /**
     * Getter of Req.
     * Return null if Req is null or undefined.
     *
     * @return {*}
     */
    getReq: function () {
        if (this.Req == undefined || this.Req == null) {
            this.errorStack.push("[ERROR][REQUEST PARSER][GET REQ] #Req# was either null or undefined.");
            console.log("[ERROR][REQUEST PARSER][GET REQ] #Req# was either null or undefined.");
            return null;
        }
        return this.Req;
    },

    /**
     * Getter of Options.
     *
     * @return {{aggregate: boolean, rawRes: boolean, customReq: boolean}}
     */
    getOptions: function () {
        return this.options;
    },

    /**
     * Getter getCountParsed.
     *
     * @return {number}
     */
    getCountParsed: function () {
        return this.parsed;
    },

    /**
     * Getter of errorStack.
     *
     * @return {Array}
     */
    getErrorStack: function () {
        return this.errorStack;
    },

    /**
     * Initialization function.
     * If you need to clean-up this instance.
     */
    initialize: function () {
        this.rawReq = null;
        this.Req = null;
        this.parsed = -1;
        this.options = {
            aggregate: false,
            rawRes: false,
            customReq: false
        };
        this.errorStack = [];
    }
};

module.exports = RequestParser;