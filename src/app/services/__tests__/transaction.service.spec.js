/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate transaction retrieval with pagination and individual transaction details
- Scenario: Tests API calls for paginated transaction lists and single transaction retrieval
- Expected Result: Transactions are retrieved correctly with pagination support
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend;
    var API_BASE = '/api/transactions';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should retrieve paginated transactions from API', function() {
        var mockResponse = {
          transactions: [
            { transactionId: 'txn-001', merchantName: 'Starbucks', amount: 10 },
            { transactionId: 'txn-002', merchantName: 'Shell Gas', amount: 50 }
          ],
          totalRecords: 100,
          currentPage: 1,
          pageSize: 20
        };

        $httpBackend.expectGET(API_BASE + '?page=1&size=20').respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(1, 20).then(function(response) {
          result = response;
        });

        $httpBackend.flush();

        expect(result.transactions.length).toBe(2);
        expect(result.totalRecords).toBe(100);
        expect(result.currentPage).toBe(1);
      });

      it('should handle different page numbers and sizes', function() {
        var mockResponse = {
          transactions: [
            { transactionId: 'txn-021', merchantName: 'Amazon', amount: 100 }
          ],
          totalRecords: 100,
          currentPage: 2,
          pageSize: 10
        };

        $httpBackend.expectGET(API_BASE + '?page=2&size=10').respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(2, 10).then(function(response) {
          result = response;
        });

        $httpBackend.flush();

        expect(result.currentPage).toBe(2);
        expect(result.pageSize).toBe(10);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET(API_BASE + '?page=1&size=20').respond(500, 'Server Error');

        var error;
        TransactionService.getTransactions(1, 20).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should return empty transactions array when no data exists', function() {
        var mockResponse = {
          transactions: [],
          totalRecords: 0,
          currentPage: 1,
          pageSize: 20
        };

        $httpBackend.expectGET(API_BASE + '?page=1&size=20').respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(1, 20).then(function(response) {
          result = response;
        });

        $httpBackend.flush();

        expect(result.transactions.length).toBe(0);
        expect(result.totalRecords).toBe(0);
      });
    });

    describe('getTransactionById', function() {
      it('should retrieve a specific transaction by ID from API', function() {
        var mockTransaction = {
          transactionId: 'txn-001',
          merchantName: 'Starbucks',
          amount: 10,
          transactionDate: '2026-01-15',
          category: 'Food & Dining',
          status: 'Completed'
        };

        $httpBackend.expectGET(API_BASE + '/txn-001').respond(200, mockTransaction);

        var result;
        TransactionService.getTransactionById('txn-001').then(function(transaction) {
          result = transaction;
        });

        $httpBackend.flush();

        expect(result.transactionId).toBe('txn-001');
        expect(result.merchantName).toBe('Starbucks');
        expect(result.amount).toBe(10);
        expect(result.status).toBe('Completed');
      });

      it('should handle transaction not found error', function() {
        $httpBackend.expectGET(API_BASE + '/invalid-txn').respond(404, 'Transaction Not Found');

        var error;
        TransactionService.getTransactionById('invalid-txn').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET(API_BASE + '/txn-001').respond(500, 'Server Error');

        var error;
        TransactionService.getTransactionById('txn-001').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should retrieve transaction with complete details', function() {
        var mockTransaction = {
          transactionId: 'txn-001',
          merchantName: 'Starbucks',
          amount: 10.50,
          transactionDate: '2026-01-15T10:30:00Z',
          category: 'Food & Dining',
          status: 'Completed',
          cardId: 'card-001',
          description: 'Coffee purchase'
        };

        $httpBackend.expectGET(API_BASE + '/txn-001').respond(200, mockTransaction);

        var result;
        TransactionService.getTransactionById('txn-001').then(function(transaction) {
          result = transaction;
        });

        $httpBackend.flush();

        expect(result.description).toBe('Coffee purchase');
        expect(result.cardId).toBe('card-001');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered:
  * Paginated transaction retrieval
  * Different page numbers and sizes
  * API error handling (500, 404)
  * Empty result handling
  * Single transaction retrieval
  * Complete transaction details
- Uncovered scenarios: None - comprehensive coverage achieved
*/