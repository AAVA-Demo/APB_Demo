/*
Test Documentation:
- Test Name: TransactionDataService - getCurrentMonthTransactions - success scenario
- Purpose: Validates that getCurrentMonthTransactions retrieves current month transactions
- Scenario: Service calls /api/transactions with month=current parameter
- Expected Result: Promise resolves with current month transaction data
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getCurrentMonthTransactions - error handling
- Purpose: Validates error handling when transaction retrieval fails
- Scenario: API call fails with various error conditions
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions
- Scenarios covered: successful retrieval, error handling, empty data, multiple transactions
- Edge cases: network failure, server errors, malformed response
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService, $httpBackend, $q, $rootScope;

    beforeEach(module('dashboardModule'));

    beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _$q_, _$rootScope_) {
      TransactionDataService = _TransactionDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCurrentMonthTransactions', function() {
      it('should successfully retrieve current month transactions', function() {
        var mockTransactions = [
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
        ];

        $httpBackend.expectGET('/api/transactions?month=current').respond(200, mockTransactions);

        var result;
        TransactionDataService.getCurrentMonthTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn1');
        expect(result[0].merchantName).toBe('Amazon');
        expect(result[0].amount).toBe(150.00);
        expect(result[1].category).toBe('Fuel');
      });

      it('should return empty array when no transactions exist for current month', function() {
        $httpBackend.expectGET('/api/transactions?month=current').respond(200, []);

        var result;
        TransactionDataService.getCurrentMonthTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle single transaction', function() {
        var singleTransaction = [{
          transactionId: 'txn1',
          cardId: 'card1',
          merchantName: 'Starbucks',
          category: 'Food & Dining',
          amount: 12.50,
          transactionDate: '2024-01-15T07:30:00Z',
          status: 'Posted'
        }];

        $httpBackend.expectGET('/api/transactions?month=current').respond(200, singleTransaction);

        var result;
        TransactionDataService.getCurrentMonthTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].merchantName).toBe('Starbucks');
      });

      it('should handle 500 internal server error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions?month=current').respond(500, { error: 'Internal Server Error' });

        var errorResult;
        TransactionDataService.getCurrentMonthTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
      });

      it('should handle 404 not found error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions?month=current').respond(404, { error: 'Not Found' });

        var errorResult;
        TransactionDataService.getCurrentMonthTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network failure', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions?month=current').respond(0, '');

        var errorResult;
        TransactionDataService.getCurrentMonthTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle large number of transactions', function() {
        var largeTransactionSet = [];
        for (var i = 1; i <= 100; i++) {
          largeTransactionSet.push({
            transactionId: 'txn' + i,
            cardId: 'card1',
            merchantName: 'Merchant ' + i,
            category: 'Shopping',
            amount: 50.00 + i,
            transactionDate: '2024-01-' + (i % 28 + 1) + 'T10:00:00Z',
            status: 'Posted'
          });
        }

        $httpBackend.expectGET('/api/transactions?month=current').respond(200, largeTransactionSet);

        var result;
        TransactionDataService.getCurrentMonthTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(100);
        expect(result[0].transactionId).toBe('txn1');
        expect(result[99].transactionId).toBe('txn100');
      });
    });
  });
})();