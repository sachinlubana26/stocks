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

    // ask question to get user inputs
    // question are defined in config

}

/* validateUserInputs: function to validate user inputs provided to fetch stock performance */
function validateUserInputs(inputs) {

    // validate user inputs
    // check is stock symbol is passed
    // check if start is provided
    // check if provided start date is of valid format
    // check if end date is provided
    // check if provided end date is of valid format
    // set end date to today if not provided
    // check if start date and end date range is valid
    
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

