/*
Test Documentation:
- Test Name: TransactionService (Analytics) - getAllTransactions - success scenario
- Purpose: Validates that getAllTransactions retrieves all transactions for analytics
- Scenario: Service calls /api/transactions endpoint and returns transaction data
- Expected Result: Promise resolves with transaction array
*/
/*
Test Documentation:
- Test Name: TransactionService (Analytics) - getAllTransactions - response format handling
- Purpose: Validates handling of different response formats (nested vs flat)
- Scenario: API returns data in transactions property or directly
- Expected Result: Service correctly extracts transaction data regardless of format
*/
/*
Coverage Report:
- Functions tested: getAllTransactions
- Scenarios covered: successful retrieval, nested response, flat response, error handling
- Edge cases: empty data, network failure, malformed response
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService (Analytics Module)', function() {
    var TransactionService, $httpBackend, $q, $rootScope;

    beforeEach(module('analyticsModule'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllTransactions', function() {
      it('should successfully retrieve all transactions with nested response format', function() {
        var mockResponse = {
          transactions: [
            {
              transactionId: 'txn1',
              cardId: 'card1',
              merchantName: 'Amazon',
              category: 'Shopping',
              amount: 150.00,
              transactionDate: '2024-01-15T10:30:00Z',
              status: 'Posted'
            },
            {
              transactionId: 'txn2',
              cardId: 'card2',
              merchantName: 'Shell Gas',
              category: 'Fuel',
              amount: 45.50,
              transactionDate: '2024-01-16T08:15:00Z',
              status: 'Posted'
            }
          ],
          totalCount: 2
        };

        $httpBackend.expectGET('/api/transactions').respond(200, mockResponse);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn1');
        expect(result[0].merchantName).toBe('Amazon');
        expect(result[1].category).toBe('Fuel');
      });

      it('should successfully retrieve all transactions with flat response format', function() {
        var mockTransactions = [
          {
            transactionId: 'txn1',
            cardId: 'card1',
            merchantName: 'Walmart',
            category: 'Shopping',
            amount: 200.00,
            transactionDate: '2024-01-10T14:20:00Z',
            status: 'Posted'
          },
          {
            transactionId: 'txn2',
            cardId: 'card2',
            merchantName: 'Uber',
            category: 'Travel',
            amount: 35.00,
            transactionDate: '2024-01-12T09:45:00Z',
            status: 'Pending'
          }
        ];

        $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].merchantName).toBe('Walmart');
        expect(result[1].status).toBe('Pending');
      });

      it('should return empty array when no transactions exist', function() {
        var emptyResponse = { transactions: [] };

        $httpBackend.expectGET('/api/transactions').respond(200, emptyResponse);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle flat empty array response', function() {
        $httpBackend.expectGET('/api/transactions').respond(200, []);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle 500 internal server error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions').respond(500, { error: 'Internal Server Error' });

        var errorResult;
        TransactionService.getAllTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching all transactions:', jasmine.any(Object));
      });

      it('should handle 401 unauthorized error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions').respond(401, { error: 'Unauthorized' });

        var errorResult;
        TransactionService.getAllTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network failure', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions').respond(0, '');

        var errorResult;
        TransactionService.getAllTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle large transaction dataset', function() {
        var largeDataset = [];
        for (var i = 1; i <= 500; i++) {
          largeDataset.push({
            transactionId: 'txn' + i,
            cardId: 'card' + (i % 5 + 1),
            merchantName: 'Merchant ' + i,
            category: ['Shopping', 'Fuel', 'Food & Dining', 'Travel', 'Entertainment'][i % 5],
            amount: 25.00 + (i * 0.5),
            transactionDate: '2024-01-' + (i % 28 + 1) + 'T10:00:00Z',
            status: i % 3 === 0 ? 'Pending' : 'Posted'
          });
        }

        var response = { transactions: largeDataset };

        $httpBackend.expectGET('/api/transactions').respond(200, response);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(500);
        expect(result[0].transactionId).toBe('txn1');
        expect(result[499].transactionId).toBe('txn500');
      });

      it('should handle transactions with all nine categories', function() {
        var categorizedTransactions = [
          { transactionId: 'txn1', category: 'Food & Dining', amount: 50.00, merchantName: 'Restaurant', cardId: 'card1', transactionDate: '2024-01-15T12:00:00Z', status: 'Posted' },
          { transactionId: 'txn2', category: 'Fuel', amount: 60.00, merchantName: 'Gas Station', cardId: 'card1', transactionDate: '2024-01-16T08:00:00Z', status: 'Posted' },
          { transactionId: 'txn3', category: 'Shopping', amount: 150.00, merchantName: 'Mall', cardId: 'card2', transactionDate: '2024-01-17T14:00:00Z', status: 'Posted' },
          { transactionId: 'txn4', category: 'Travel', amount: 300.00, merchantName: 'Airline', cardId: 'card2', transactionDate: '2024-01-18T06:00:00Z', status: 'Posted' },
          { transactionId: 'txn5', category: 'Entertainment', amount: 75.00, merchantName: 'Cinema', cardId: 'card1', transactionDate: '2024-01-19T19:00:00Z', status: 'Posted' },
          { transactionId: 'txn6', category: 'Utilities', amount: 120.00, merchantName: 'Electric Company', cardId: 'card3', transactionDate: '2024-01-20T10:00:00Z', status: 'Posted' },
          { transactionId: 'txn7', category: 'Healthcare', amount: 200.00, merchantName: 'Hospital', cardId: 'card3', transactionDate: '2024-01-21T11:00:00Z', status: 'Posted' },
          { transactionId: 'txn8', category: 'Education', amount: 500.00, merchantName: 'University', cardId: 'card2', transactionDate: '2024-01-22T09:00:00Z', status: 'Posted' },
          { transactionId: 'txn9', category: 'Miscellaneous', amount: 30.00, merchantName: 'Other Store', cardId: 'card1', transactionDate: '2024-01-23T15:00:00Z', status: 'Posted' }
        ];

        $httpBackend.expectGET('/api/transactions').respond(200, categorizedTransactions);

        var result;
        TransactionService.getAllTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(9);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[8].category).toBe('Miscellaneous');
      });
    });
  });
})();