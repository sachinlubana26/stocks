'use strict'

/*
 * Utils module containing utility functions
*/

const chalk = require('chalk');
const rl = require('readline');

const env = process.env.NODE_ENV || 'development';

// list of functions that are exported
module.exports = {
    log,
    logInfo,
    logError,
    prompt,
    validateCLIArgs,
    showUsage
}

/* prompt: function to ask question to collect user inputs */
function prompt(question) {
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    return new Promise((resolve, error) => {
        r.question(question, answer => {
            r.close()
            resolve(answer)
        });
    })
}

/* logInfo: function to log debug statements */
function logInfo(logMe) {
    if (env != 'development') return;
    const iLog = chalk.yellow(logMe);
    console.log(iLog);
}

/* log: function equivalent to console log */
function log(logMe) {
    const iLog = chalk.yellow(logMe);
    console.log(iLog);
}

/* logError: function to log error statements */
function logError(error) {
    if (env == 'testing') return;
    const eLog = chalk.red(error);
    console.log(eLog);
}

/* validateCLIArgs: function to validate the CLI args provided by user */
function validateCLIArgs() {
    const commands = ['info','help']
    const args = process.argv
    if (args.length > 3) {
        logError('only one argument can be accepted');
        showUsage();
    }
    if (commands.indexOf(args[2]) == -1) {
        logError('invalid command passed');
        showUsage();
    }
}

/* showUsage: function to show CLI tool usage */
function showUsage() {
    const usageText = `
    stocks application helps you to access stocks information.

    usage:
        stocks <command>

        commands can be:

        info:      used to retrieve stocks infromation
        help:     used to print the usage guide
    `;
    console.log(usageText);
    process.exit(0);
}

