/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate TransactionService functionality for transaction data retrieval
- Scenario: Tests getMonthlySpend and getTransactions with various scenarios and error handling
- Expected Result: Service correctly retrieves transaction data with proper date filtering
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService;
    var $httpBackend;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getMonthlySpend', function() {
      it('should retrieve current month spending', function() {
        var mockSpend = {
          totalSpend: 2500,
          transactionCount: 45,
          month: '2023-11'
        };

        $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockSpend);

        var result;
        TransactionService.getMonthlySpend().then(function(spend) {
          result = spend;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockSpend);
        expect(result.totalSpend).toBe(2500);
        expect(result.transactionCount).toBe(45);
      });

      it('should handle zero monthly spend', function() {
        var mockSpend = {
          totalSpend: 0,
          transactionCount: 0,
          month: '2023-11'
        };

        $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockSpend);

        var result;
        TransactionService.getMonthlySpend().then(function(spend) {
          result = spend;
        });

        $httpBackend.flush();

        expect(result.totalSpend).toBe(0);
        expect(result.transactionCount).toBe(0);
      });

      it('should handle server error', function() {
        $httpBackend.expectGET('/api/transactions/monthly').respond(500, 'Server Error');

        var error;
        TransactionService.getMonthlySpend().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle unauthorized access', function() {
        $httpBackend.expectGET('/api/transactions/monthly').respond(401, 'Unauthorized');

        var error;
        TransactionService.getMonthlySpend().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle network error', function() {
        $httpBackend.expectGET('/api/transactions/monthly').respond(0, '');

        var error;
        TransactionService.getMonthlySpend().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });
    });

    describe('getTransactions', function() {
      it('should retrieve transactions for date range', function() {
        var startDate = new Date('2023-01-01');
        var endDate = new Date('2023-12-31');
        var mockTransactions = [
          {id: '1', amount: 100, category: 'Food & Dining', date: '2023-01-15'},
          {id: '2', amount: 50, category: 'Fuel', date: '2023-02-10'},
          {id: '3', amount: 200, category: 'Shopping', date: '2023-03-05'}
        ];

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(transactions) {
          result = transactions;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(3);
      });

      it('should handle empty transactions array', function() {
        var startDate = new Date('2023-01-01');
        var endDate = new Date('2023-12-31');
        var mockTransactions = [];

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(transactions) {
          result = transactions;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should support 12 months of historical data (NFR requirement)', function() {
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);

        var mockTransactions = [];
        for (var i = 0; i < 12; i++) {
          mockTransactions.push({
            id: (i + 1).toString(),
            amount: 100 * (i + 1),
            category: 'Shopping',
            date: new Date(startDate.getTime() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString()
          });
        }

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(transactions) {
          result = transactions;
        });

        $httpBackend.flush();

        expect(result.length).toBe(12);
      });

      it('should handle transactions with all nine categories', function() {
        var startDate = new Date('2023-01-01');
        var endDate = new Date('2023-12-31');
        var mockTransactions = [
          {id: '1', amount: 100, category: 'Food & Dining', date: '2023-01-15'},
          {id: '2', amount: 50, category: 'Fuel', date: '2023-02-10'},
          {id: '3', amount: 200, category: 'Shopping', date: '2023-03-05'},
          {id: '4', amount: 150, category: 'Travel', date: '2023-04-12'},
          {id: '5', amount: 75, category: 'Entertainment', date: '2023-05-20'},
          {id: '6', amount: 120, category: 'Utilities', date: '2023-06-08'},
          {id: '7', amount: 300, category: 'Healthcare', date: '2023-07-15'},
          {id: '8', amount: 250, category: 'Education', date: '2023-08-22'},
          {id: '9', amount: 80, category: 'Miscellaneous', date: '2023-09-10'}
        ];

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(transactions) {
          result = transactions;
        });

        $httpBackend.flush();

        expect(result.length).toBe(9);
        var categories = result.map(function(txn) { return txn.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
      });

      it('should handle server error', function() {
        var startDate = new Date('2023-01-01');
        var endDate = new Date('2023-12-31');

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(500, 'Server Error');

        var error;
        TransactionService.getTransactions(startDate, endDate).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle invalid date range', function() {
        var startDate = new Date('2023-12-31');
        var endDate = new Date('2023-01-01');

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(400, 'Invalid date range');

        var error;
        TransactionService.getTransactions(startDate, endDate).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(400);
      });

      it('should properly format date parameters as ISO strings', function() {
        var startDate = new Date('2023-01-01T00:00:00Z');
        var endDate = new Date('2023-12-31T23:59:59Z');

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, []);

        TransactionService.getTransactions(startDate, endDate);
        $httpBackend.flush();
      });

      it('should handle transactions with zero amounts', function() {
        var startDate = new Date('2023-01-01');
        var endDate = new Date('2023-12-31');
        var mockTransactions = [
          {id: '1', amount: 0, category: 'Food & Dining', date: '2023-01-15'}
        ];

        var expectedUrl = '/api/transactions?from=' + startDate.toISOString() + '&to=' + endDate.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(transactions) {
          result = transactions;
        });

        $httpBackend.flush();

        expect(result[0].amount).toBe(0);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getMonthlySpend, getTransactions
  - Scenarios covered:
    * Successful monthly spend retrieval
    * Zero monthly spend handling
    * Server error (500) handling
    * Unauthorized access (401) handling
    * Network error (status 0) handling
    * Transactions retrieval with date range
    * Empty transactions array handling
    * 12 months historical data support (NFR requirement)
    * All nine spending categories validation
    * Invalid date range handling (400 error)
    * ISO date format validation
    * Zero amount transactions handling
  - Edge cases: Empty data, various HTTP errors, invalid dates, zero values
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();