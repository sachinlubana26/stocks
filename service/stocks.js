'use strict'

/*
 * stock service module with function to evaluate stock performance
*/

const moment = require('moment');

const config = require('../config/')
const utils = require('./utils');

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

    // use stock api to fetch stock performance
    // for a given stock symbol and date range
    // make web service call here
    
}

/* displayStockInfo: function to build output of stock performance */
function displayStockInfo(info) {

    // display stock information based on format defined in config
    // simply parse the stock information fetched from api
    
}

/* getStocksInfo: function to get stock information */
async function getStocksInfo(userInputs) {

    /*
    step 1: validate user inputs
    step 2: fetch stock information using API
    step 3: display stock information
    step 4: send slack notification to slack channel
    */

}

