'use strict'

/*
 * Slack service module containing slack utility functions
*/

const { IncomingWebhook } = require('@slack/client');

const config = require('../config/');
const utils = require('./utils');

const webhook = new IncomingWebhook(config.notification.slack.webhook);
const env = process.env.NODE_ENV || 'development';

/* notify: function to send slack notifications */
function notify(message) {

    if(env != 'production') {
        return;
    }

    webhook.send(message, function(err, res) {
        if (err) {
            utils.logError('Error:', err);
        } 
    });
}

/* notifyStockInfo: function to send stock info to slack channel*/
function notifyStockInfo(inputs, info) {
    let message = "```\nStock: [STOCK_NAME]\n\nEvaluation dates: [START_DATE] to [END_DATE]\n\nStock Information:\n[INFO]\n```";
    message = message.replace("[STOCK_NAME]", inputs.stockSymbol);
    message = message.replace("[START_DATE]", inputs.evalStartDate);
    message = message.replace("[END_DATE]", inputs.evalEndDate);
    message = message.replace("[INFO]", info);
    notify({"text": message, "mrkdwn": true});
}

module.exports = {
    notifyStockInfo
}



