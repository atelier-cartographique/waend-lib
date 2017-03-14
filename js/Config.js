"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store = {};
exports.getconfig = (key) => {
    if (key in store) {
        return Promise.resolve(store[key]);
    }
    return (fetch(`/api/config/${key}`)
        .then((response) => {
        if (!response.ok) {
            throw (new Error(`FaildConfig ${key}`));
        }
        return response.text();
    })
        .then((text) => {
        store[key] = text;
        return text;
    }));
};
