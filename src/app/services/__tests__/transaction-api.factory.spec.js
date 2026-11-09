/*
Test Documentation:
- Test Name: TransactionAPI Factory - getTransactionSummary success
- Purpose: Validates that getTransactionSummary successfully retrieves transaction summary data
- Scenario: Valid userId provided, API returns success response
- Expected Result: Promise resolves with transaction summary data
*/
/*
Test Documentation:
- Test Name: TransactionAPI Factory - fetchTransactions success
- Purpose: Validates that fetchTransactions successfully retrieves transactions within time range
- Scenario: Valid userId and timeRange provided, API returns transactions array
- Expected Result: Promise resolves with transactions data
*/
/*
Test Documentation:
- Test Name: TransactionAPI Factory - error handling
- Purpose: Validates error handling for both getTransactionSummary and fetchTransactions
- Scenario: API returns error responses
- Expected Result: Promises are rejected and errors are logged
*/
/*
Coverage Report:
- Functions tested: getTransactionSummary, fetchTransactions
- Scenarios covered: success responses, API errors, empty results, date range handling, error logging
- Uncovered scenarios: transaction categorization (handled by CategoryAPI)
*/

(function() {
  'use strict';

  describe('TransactionAPI Factory', function() {
    var TransactionAPI, $httpBackend, $q, API_CONFIG;
    var baseUrl = 'https://api.creditcard.demo';
    var transactionsEndpoint = '/api/transactions';
    var transactionsSummaryEndpoint = '/api/transactions/summary';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionAPI_, _$httpBackend_, _$q_, _API_CONFIG_) {
      TransactionAPI = _TransactionAPI_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactionSummary', function() {
      it('should successfully fetch transaction summary with valid userId', function() {
        var userId = 'user123';
        var mockResponse = {
          userId: 'user123',
          monthlySpend: 5000,
          outstandingAmount: 15000,
          totalTransactions: 45,
          lastTransactionDate: '2024-11-15T10:30:00Z'
        };

        var expectedUrl = baseUrl + transactionsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        TransactionAPI.getTransactionSummary(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.monthlySpend).toBe(5000);
        expect(result.outstandingAmount).toBe(15000);
        expect(result.totalTransactions).toBe(45);
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + transactionsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        TransactionAPI.getTransactionSummary(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Transaction summary API error:', jasmine.any(Object));
      });

      it('should handle zero transactions scenario', function() {
        var userId = 'newUser';
        var mockResponse = {
          userId: 'newUser',
          monthlySpend: 0,
          outstandingAmount: 0,
          totalTransactions: 0,
          lastTransactionDate: null
        };

        var expectedUrl = baseUrl + transactionsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        TransactionAPI.getTransactionSummary(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalTransactions).toBe(0);
        expect(result.lastTransactionDate).toBeNull();
      });

      it('should handle 404 error for invalid userId', function() {
        var userId = 'invalidUser';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + transactionsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(404, { message: 'User not found' });

        var error;
        TransactionAPI.getTransactionSummary(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('fetchTransactions', function() {
      it('should successfully fetch transactions with valid parameters', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var mockResponse = [
          {
            transactionId: 'txn1',
            amount: 150.50,
            merchantName: 'Restaurant ABC',
            category: 'Food & Dining',
            date: '2024-11-01T12:00:00Z',
            cardId: 'card1'
          },
          {
            transactionId: 'txn2',
            amount: 50.00,
            merchantName: 'Gas Station XYZ',
            category: 'Fuel',
            date: '2024-11-02T08:30:00Z',
            cardId: 'card1'
          }
        ];

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        TransactionAPI.fetchTransactions(userId, timeRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
        expect(result[0].amount).toBe(150.50);
        expect(result[1].category).toBe('Fuel');
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        TransactionAPI.fetchTransactions(userId, timeRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Fetch transactions API error:', jasmine.any(Object));
      });

      it('should return empty array when no transactions in time range', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31')
        };
        var mockResponse = [];

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        TransactionAPI.fetchTransactions(userId, timeRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should properly format ISO date strings in request parameters', function() {
        var userId = 'user123';
        var startDate = new Date('2024-06-15T10:30:00.000Z');
        var endDate = new Date('2024-12-15T23:59:59.999Z');
        var timeRange = {
          startDate: startDate,
          endDate: endDate
        };

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, []);

        TransactionAPI.fetchTransactions(userId, timeRange);

        $httpBackend.flush();
      });

      it('should handle transactions across all spending categories', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };
        var mockResponse = [
          { transactionId: 'txn1', amount: 100, category: 'Food & Dining' },
          { transactionId: 'txn2', amount: 50, category: 'Fuel' },
          { transactionId: 'txn3', amount: 200, category: 'Shopping' },
          { transactionId: 'txn4', amount: 500, category: 'Travel' },
          { transactionId: 'txn5', amount: 75, category: 'Entertainment' },
          { transactionId: 'txn6', amount: 120, category: 'Utilities' },
          { transactionId: 'txn7', amount: 300, category: 'Healthcare' },
          { transactionId: 'txn8', amount: 250, category: 'Education' },
          { transactionId: 'txn9', amount: 30, category: 'Miscellaneous' }
        ];

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        TransactionAPI.fetchTransactions(userId, timeRange).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(9);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[8].category).toBe('Miscellaneous');
      });

      it('should handle 12-month historical data requirement', function() {
        var userId = 'user123';
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12);
        var timeRange = {
          startDate: startDate,
          endDate: endDate
        };

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(200, []);

        TransactionAPI.fetchTransactions(userId, timeRange);

        $httpBackend.flush();
      });

      it('should handle network timeout error', function() {
        var userId = 'user123';
        var timeRange = {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + transactionsEndpoint + 
          '?userId=' + userId + 
          '&startDate=' + encodeURIComponent(timeRange.startDate.toISOString()) + 
          '&endDate=' + encodeURIComponent(timeRange.endDate.toISOString());

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        TransactionAPI.fetchTransactions(userId, timeRange).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();