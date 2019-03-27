'use strict';

const rp = require('request-promise');

var run = function(options) {
    return new Promise((resolve, reject) => {
        rp(options)
        .then(function (response) {
            resolve(response);
        })
        .catch(function (err) {
            reject(err);
        });
    })
}

module.exports = {
    run
}
