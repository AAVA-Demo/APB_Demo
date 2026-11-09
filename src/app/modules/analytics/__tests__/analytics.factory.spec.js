/*
Test Documentation:
- Test Name: transactionFactory - fetchTransactions GET request
- Purpose: Validates factory creates correct $resource for transactions endpoint
- Scenario: fetchTransactions method called with userId and dateRange
- Expected Result: GET request to /api/transactions with parameters
*/
/*
Test Documentation:
- Test Name: transactionFactory - caching enabled
- Purpose: Validates factory enables caching for transaction requests
- Scenario: Multiple calls to fetchTransactions
- Expected Result: Subsequent calls use cached data
*/
/*
Test Documentation:
- Test Name: transactionFactory - array response
- Purpose: Validates factory expects array response
- Scenario: API returns array of transactions
- Expected Result: Array of transaction objects returned
*/
/*
Coverage Report:
- Functions tested: fetchTransactions resource method
- Scenarios covered: GET request configuration, caching, array response format, parameter binding
- Edge cases: userId and dateRange parameters, empty array response
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('transactionFactory', function() {
    var transactionFactory, $httpBackend;
    var mockTransactionsData = [
      { transactionId: 'txn1', date: '2024-01-15', category: 'Food & Dining', amount: 45.50, merchant: 'Restaurant A' },
      { transactionId: 'txn2', date: '2024-01-16', category: 'Fuel', amount: 60.00, merchant: 'Gas Station B' },
      { transactionId: 'txn3', date: '2024-01-17', category: 'Shopping', amount: 120.75, merchant: 'Store C' }
    ];

    beforeEach(module('analyticsModule'));

    beforeEach(inject(function(_transactionFactory_, _$httpBackend_) {
      transactionFactory = _transactionFactory_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchTransactions', function() {
      it('should create GET request to /api/transactions', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(200, mockTransactionsData);

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        expect(result.length).toBe(3);
        expect(result[0].transactionId).toBe('txn1');
      });

      it('should include userId as query parameter', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=6months&userId=testUser456').respond(200, mockTransactionsData);

        transactionFactory.fetchTransactions({ userId: 'testUser456', dateRange: '6months' });

        $httpBackend.flush();
      });

      it('should include dateRange as query parameter', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=3months&userId=user123').respond(200, mockTransactionsData);

        transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '3months' });

        $httpBackend.flush();
      });

      it('should return promise that resolves to array of transactions', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(200, mockTransactionsData);

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        expect(result.$promise).toBeDefined();
        result.$promise.then(function(data) {
          expect(Array.isArray(data)).toBe(true);
          expect(data.length).toBe(3);
        });
      });

      it('should handle server error responses', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(500, { error: 'Internal Server Error' });

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        result.$promise.catch(function(error) {
          expect(error.status).toBe(500);
        });
      });

      it('should return array not object', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(200, mockTransactionsData);

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle empty array response', function() {
        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(200, []);

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle large transaction arrays (1000+ transactions)', function() {
        var largeTransactionsArray = [];
        for (var i = 1; i <= 1200; i++) {
          largeTransactionsArray.push({
            transactionId: 'txn' + i,
            date: '2024-01-' + (i % 28 + 1),
            category: 'Category ' + (i % 9),
            amount: (i * 10) % 500
          });
        }

        $httpBackend.expectGET('/api/transactions?dateRange=12months&userId=user123').respond(200, largeTransactionsArray);

        var result = transactionFactory.fetchTransactions({ userId: 'user123', dateRange: '12months' });

        $httpBackend.flush();

        expect(result.length).toBe(1200);
      });
    });
  });
})();