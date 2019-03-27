const assert = require('chai').assert;
process.env.NODE_ENV = 'testing';
const service = require('../service/stocks');


describe('unit test for stock service', function () {

    it('empty user input should return error', async () => {
        let err = await service.getStocksInfo({});
        assert.include(err, 'E102'); 
        assert.include(err, 'E103'); 
    });

    it('empty stock type input should return error', async () => {
        let input = {stockSymbol: "", evalStartDate:"2019-01-01"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E102');
    });

    it('empty start date input should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:""};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E103');
    });

    it('invalid start date input should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2019"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E103');
    });

    it('incorrect start date format input should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"01-12-2019"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E103');
    });

    it('invalid end date input should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2019-01-23", evalEndDate:"2019"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E104');
    });

    it('incorrect end date format input should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2019-01-23", evalEndDate:"01-23-2019"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E104');
    });

    it('invalid date range should return error', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2019-01-23", evalEndDate:"2018-01-23"};
        let err = await service.getStocksInfo(input);
        assert.include(err, 'E105');
    });

    it('valid input data but no stock information found for given input', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2019-01-23"};
        let resp = await service.getStocksInfo(input);
        assert.equal(resp, null);
    });

    it('valid input data and should return stock information', async () => {
        let input = {stockSymbol: "AAPL", evalStartDate:"2018-03-21", evalEndDate:"2018-03-25"};
        let resp = await service.getStocksInfo(input);
        assert.isAbove(resp, 0);
    });    

});

