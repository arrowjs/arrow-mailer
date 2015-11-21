"use strict";
const mailer = require('nodemailer'),
    smtpPool = require('nodemailer-smtp-pool');

module.exports = function (options) {
    options = options || {};
    let fileFolder = options.settingFile || "config/mail.js";
    let baseFile = __dirname + '/mail.js';
    return function () {
        let arrowApp = this;
        let allSetting = arrowApp.utils.loadAndCreate(fileFolder,baseFile);
        arrowApp.addConfig(allSetting);
        arrowApp.mailSender = mailer.createTransport(smtpPool(arrowApp.getConfig('mailer_config')));
        arrowApp.sendMail =  function (mailOptions) {
            return new Promise(function (fulfill, reject) {
                arrowApp.mailSender.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(info);
                    }
                });
            });
        }
        return arrowApp
    }
};

