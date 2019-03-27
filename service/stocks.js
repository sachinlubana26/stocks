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

/* caclulateDrawdowns: function to calculate draw downs */
function caclulateDrawdowns(stockInfo) {
    let maxDrawDown = '';
    let maxDrawDownIndex = '';
    let counter = 1;
    let firstThreeDrawDown = 'First 3 Drawdowns:\n\n';
    for (let i = (stockInfo.length-1); i >= 0; i--) {
        if(counter > config.drawDownLimit) break;
        const elem = stockInfo[i];
        const day = elem[1];
        const low = elem[4];
        const high = elem[3];
        let drawDown = ((low-high) / low) * 100;
        drawDown = parseFloat(drawDown).toPrecision(2);
        firstThreeDrawDown += drawDown + '%\t\t' + '(' + high + ' on ' + day + '\t->\t' + low + ' on ' + day+')\n';
        counter++;
        if (!maxDrawDown || drawDown > maxDrawDown) {
            maxDrawDownIndex = i;
            maxDrawDown = drawDown;
        }
    }
    utils.log(firstThreeDrawDown);
    let elem = stockInfo[maxDrawDownIndex]
    utils.log('Maximum drawdown:\n'+maxDrawDown + '%\t\t ' + '(' + elem[3] + ' on ' + elem[1] + '\t->\t' + elem[4] + ' on ' + elem[1]+')\n');
}

/* caclulateReturns: function to calculate returns */
function caclulateReturns(stockInfo) {
    const start = stockInfo[stockInfo.length-1];
    const end = stockInfo[0];
    const sClose = start[5];
    const eClose = end[5];
    let retVal = eClose-sClose;
    let retPer = (retVal / eClose) * 100;
    retPer = parseFloat(retPer).toPrecision(2);
    //Return: 2.740000000000009 [+1.6%] (172.26 on 02.01.18 -> 175.0 on 05.01.18)
    utils.log('Return:\n ' + retVal + '\t [' + retPer  + '%]\t(' + sClose + ' on ' + start[1] + '\t->\t' + eClose + ' on ' + end[1] + ')\n'); 
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

        // calculate drawdowns
        caclulateDrawdowns(stockInfo.datatable.data);

        // calculate returns
        caclulateReturns(stockInfo.datatable.data);
       
        // send slack notification (prod only env)
        slack.notifyStockInfo(userInputs, output);

        // return length of the data fetched from API
        return stockInfo.datatable.data.length;

    } catch(err) {
        utils.logError(err);
    }
}

