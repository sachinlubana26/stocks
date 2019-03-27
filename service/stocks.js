'use strict'

/*
 * stock service module with function to evaluate stock performance
*/

const moment = require('moment');

const config = require('../config/')
const utils = require('./utils');
const request = require('./http');
const slack = require('./slack');

const errorMessages = config.errorMessages;

module.exports = {
    getStocksInfo,
    getUserInputs
}

/* getUserInputs: function to get user inputs for evaluating stock performance */
async function getUserInputs() {
    try {
        var inputObj =  {};
        const questionsObj = config.inputQuestions;
        const keys = Object.keys(questionsObj);
        for (const questType of keys) {
            let question = questionsObj[questType];
            inputObj[questType] = await utils.prompt(question);
        }
        return inputObj;
    } catch(err) {
        return err;
    }
}

/* validateUserInputs: function to validate user inputs provided to fetch stock performance */
function validateUserInputs(inputs) {
    const errors = {};

    // check if stock symbol is given by user
    if (!inputs.stockSymbol || inputs.stockSymbol == '') {
        errors['E102'] = errorMessages['E102'];
    }

    // check if start date is given and is of valid date format
    if (!inputs.evalStartDate || (inputs.evalStartDate && !moment(inputs.evalStartDate, config.dateFormat,true).isValid()) ) {
        errors['E103'] = errorMessages['E103'];
        return {inputs, errors}
    }

    // check if given end date is of valid date format
    if (inputs.evalEndDate  && !moment(inputs.evalEndDate, config.dateFormat,true).isValid()) {
        errors['E104'] = errorMessages['E104'];
        return {inputs, errors}
    }

    // set todays date as end date if not given
    if (!inputs.evalEndDate) {
        inputs.evalEndDate = moment().format(config.dateFormat);
    }

    // check if date range is valid
    if (moment(inputs.evalStartDate).isAfter(inputs.evalEndDate)) {
        errors['E105'] = errorMessages['E105'];
        return {inputs, errors}
    }

    if (Object.keys(errors).length === 0) return {inputs, errors: null}

    return {inputs, errors}
}

/* getStockPerformance: function to get stock performance information */
async function getStockPerformance(userInputs) {
    try {
        let opts = config.stocksAPI;
        let requestParams = opts.requestParams;
        requestParams = requestParams.replace("[TICKER]", userInputs.stockSymbol);
        requestParams = requestParams.replace("[START_DATE]", userInputs.evalStartDate);
        requestParams = requestParams.replace("[END_DATE]", userInputs.evalEndDate);
        const options = {
            method: opts.method,
            uri: `${opts.uri}${requestParams}`
        }
        let response = await request.run(options);
        return JSON.parse(response);
    } catch(err) {
        return err;
    }
}

/* displayStockInfo: function to build output of stock performance */
function displayStockInfo(info) {
    const data = info.datatable.data;
    const logFormat = config.displayOutput.info;
    let output = config.displayOutput.header;
    for (let elem of data) {
        let log = logFormat.replace("[DATE]", elem[1]);
        log = log.replace("[HIGH]", elem[3]);
        log = log.replace("[LOW]", elem[4]);
        log = log.replace("[CLOSE]", elem[5]);
        output += log+"\n";
    }
    return output;
}

/* getStocksInfo: function to get stock information */
async function getStocksInfo(userInputs) {
    try {
        let resp = validateUserInputs(userInputs);
        if (resp.errors) {
            let error = Object.values(resp.errors).join("\n");
            utils.logError(error);
            return Object.keys(resp.errors);
        }

        userInputs = resp.inputs;

        // get stock information using API ofr given user input
        let stockInfo = await getStockPerformance(userInputs);
        if (stockInfo.datatable.data.length === 0) {
            utils.logInfo("\nNo stock information found for the given date range\n");
            return null;
        }

        // display stock performance output 
        let output = displayStockInfo(stockInfo);
        utils.log(`\nOUTPUT\n\n${output}`);
       
        // send slack notification (prod only env)
        slack.notifyStockInfo(userInputs, output);

        // return length of the data fetched from API
        return stockInfo.datatable.data.length;

    } catch(err) {
        utils.logError(err);
    }
}

