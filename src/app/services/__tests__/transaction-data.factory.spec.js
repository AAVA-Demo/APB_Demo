/*
Test Documentation:
- Test Name: TransactionDataFactory Test Suite
- Purpose: Validate transaction data fetching for multiple credit cards
- Scenario: Tests fetchTransactions function with API success, failure, and mock data generation
- Expected Result: Returns transaction data for specified card IDs with proper error handling
*/

(function() {
  'use strict';

  describe('TransactionDataFactory', function() {
    var TransactionDataFactory, $httpBackend;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_) {
      TransactionDataFactory = _TransactionDataFactory_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchTransactions function', function() {
      it('should be defined', function() {
        expect(TransactionDataFactory.fetchTransactions).toBeDefined();
        expect(typeof TransactionDataFactory.fetchTransactions).toBe('function');
      });

      it('should fetch transactions from API successfully', function() {
        var cardIds = ['card-001', 'card-002'];
        var mockTransactions = [
          {
            transactionId: 'txn-001',
            cardId: 'card-001',
            amount: 150.50,
            merchantName: 'Amazon',
            category: 'Shopping'
          },
          {
            transactionId: 'txn-002',
            cardId: 'card-002',
            amount: 75.25,
            merchantName: 'Starbucks',
            category: 'Food & Dining'
          }
        ];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001,card-002').respond(200, mockTransactions);

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
      });

      it('should build correct URL with multiple card IDs', function() {
        var cardIds = ['card-001', 'card-002', 'card-003'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001,card-002,card-003').respond(200, []);

        TransactionDataFactory.fetchTransactions(cardIds);
        $httpBackend.flush();
      });

      it('should handle single card ID', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(200, []);

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should fallback to mock data when API call fails', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Server Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });

      it('should generate 15 transactions per card ID', function() {
        var cardIds = ['card-001', 'card-002'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001,card-002').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(30);
      });

      it('should generate transactions with correct structure', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result[0]).toEqual(jasmine.objectContaining({
          transactionId: jasmine.any(String),
          cardId: jasmine.any(String),
          cardNumber: jasmine.any(String),
          amount: jasmine.any(Number),
          transactionDate: jasmine.any(String),
          merchantName: jasmine.any(String),
          category: jasmine.any(String),
          status: jasmine.any(String),
          description: jasmine.any(String)
        }));
      });

      it('should generate transactions with valid categories', function() {
        var cardIds = ['card-001'];
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        result.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
      });

      it('should generate transactions with valid status', function() {
        var cardIds = ['card-001'];
        var validStatuses = ['Posted', 'Pending'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        result.forEach(function(txn) {
          expect(validStatuses).toContain(txn.status);
        });
      });

      it('should generate transactions with amounts between 10 and 510', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        result.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThanOrEqual(10);
          expect(txn.amount).toBeLessThanOrEqual(510);
        });
      });

      it('should generate transactions with dates within last 90 days', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        var now = new Date();
        var ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        result.forEach(function(txn) {
          var txnDate = new Date(txn.transactionDate);
          expect(txnDate).toBeLessThanOrEqual(now);
          expect(txnDate).toBeGreaterThanOrEqual(ninetyDaysAgo);
        });
      });

      it('should map card IDs to correct card numbers', function() {
        var cardIds = ['card-001', 'card-002', 'card-003'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001,card-002,card-003').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        var card001Txns = result.filter(function(t) { return t.cardId === 'card-001'; });
        var card002Txns = result.filter(function(t) { return t.cardId === 'card-002'; });
        var card003Txns = result.filter(function(t) { return t.cardId === 'card-003'; });

        expect(card001Txns[0].cardNumber).toBe('**** **** **** 1234');
        expect(card002Txns[0].cardNumber).toBe('**** **** **** 5678');
        expect(card003Txns[0].cardNumber).toBe('**** **** **** 9012');
      });

      it('should handle empty card IDs array', function() {
        var cardIds = [];

        $httpBackend.expectGET('/api/transactions?cardIds=').respond(200, []);

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle null response from API', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(200, null);

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle 401 unauthorized error', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(401, 'Unauthorized');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });

      it('should return promise', function() {
        var cardIds = ['card-001'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001').respond(200, []);

        var promise = TransactionDataFactory.fetchTransactions(cardIds);

        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });

      it('should generate unique transaction IDs', function() {
        var cardIds = ['card-001', 'card-002'];

        $httpBackend.expectGET('/api/transactions?cardIds=card-001,card-002').respond(500, 'Error');

        var result;
        TransactionDataFactory.fetchTransactions(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        var ids = result.map(function(t) { return t.transactionId; });
        var uniqueIds = ids.filter(function(id, index) {
          return ids.indexOf(id) === index;
        });

        expect(uniqueIds.length).toBe(ids.length);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: fetchTransactions
  - Scenarios covered:
    * Successful API call
    * Multiple card IDs URL construction
    * Single card ID
    * API failure with fallback
    * Mock data generation (15 per card)
    * Transaction structure validation
    * Category validation
    * Status validation
    * Amount range validation
    * Date range validation (90 days)
    * Card number mapping
    * Empty card IDs
    * Null response
    * HTTP errors
    * Promise return
    * Unique transaction IDs
  - Edge cases: empty arrays, null responses, various HTTP errors
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();