"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var store = {};
exports.getconfig = function (key) {
    if (key in store) {
        return Promise.resolve(store[key]);
    }
    return (new Promise(function (resolve, reject) {
        fetch("/config/" + key)
            .then(function (response) {
            if (!response.ok) {
                throw (new Error("FaildConfig " + key));
            }
            return response.text();
        })
            .then(function (text) {
            store[key] = text;
            resolve(text);
        })
            .catch(reject);
    }));
};
