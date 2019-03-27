# Stocks Information Application (CLI)

INTRODUCTION
------------
 
Simple CLI application to show performance of a given stock within a given time period


REQUIREMENTS
------------

This module requires the following modules:

* Node.js (https://nodejs.org/en/)
* Mocha (https://www.npmjs.com/package/mocha)
* Chai (https://www.npmjs.com/package/chai)
* Quandl API (https://www.quandl.com)

INSTALLATION/ TEST
-----------------------------
	
 * npm install
 * npm test
 
USAGE
----------------------------- 

```

  stocks application helps you to access stocks information.

    usage:
        stocks <command>

        commands can be:

        info:     used to retrieve stocks infromation
        help:     used to print the usage guide

```

It will ask for user inputs to fetch stock information:

```

./stocks info
Type in your stock symbol: AAPL
Type in start date to evaluate the stock performance from (YYYY-MM-DD): 2018-03-20
Type in end date to evaluate the stock performance till (YYYY-MM-DD): 2018-03-25

```

**Stock symbol** defines the name of the stock.

**Evaluation start date** defines the start date of range to evaluate stock information from.

**Evaluation end date** defines the end date of range to evaluate stock information till.

Required date format is `YYYY-MM-DD`.

Evaluation end date defaults to today's date.


OUTPUT
----------------------------- 

```

OUTPUT

2018-03-23: Closed at 	164.94	(164.94 ~ 169.92)
2018-03-22: Closed at 	168.845	(168.6 ~ 172.68)
2018-03-21: Closed at 	171.27	(171.26 ~ 175.09)
2018-03-20: Closed at 	175.24	(174.94 ~ 176.8)

```


MAINTAINERS
-----------

Current maintainers:
 * Sachin Lubana 
 * Blog: http://sachinlubana.wordpress.com
 * Skype: lubanasachin70
 * Twitter: @lubanasachin70
 * Linkedin: https://www.linkedin.com/in/sachinlubana
