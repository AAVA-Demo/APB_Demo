/*
Test Documentation:
- Test Name: TransactionService - getTransactions success scenario
- Purpose: Validates that getTransactions successfully retrieves transaction data from API
- Scenario: HTTP GET request with date parameters returns successful response
- Expected Result: Promise resolves with transaction data array
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with date filters
- Purpose: Validates that date parameters are correctly passed to API
- Scenario: getTransactions called with startDate and endDate parameters
- Expected Result: API called with correct query parameters
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Promise rejects with error and logs error to console
*/
/*
Test Documentation:
- Test Name: TransactionService - getMockTransactions success scenario
- Purpose: Validates that getMockTransactions generates mock transaction data
- Scenario: getMockTransactions is called without parameters
- Expected Result: Promise resolves with array of 600 mock transactions (12 months × 50 per month)
*/
/*
Coverage Report:
- Functions tested: getTransactions (success/error/with params), getMockTransactions
- Scenarios covered: successful API call, failed API call, date filtering, mock data generation, transaction validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should successfully retrieve transactions from API without parameters', function() {
        var mockTransactions = [
          {transactionId: 'T001', amount: 100, date: '2024-01-15'},
          {transactionId: 'T002', amount: 200, date: '2024-01-16'}
        ];

        $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
      });

      it('should retrieve transactions with startDate parameter', function() {
        var mockTransactions = [{transactionId: 'T001', amount: 100}];
        var startDate = '2024-01-01';

        $httpBackend.expectGET('/api/transactions?startDate=' + startDate).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should retrieve transactions with both startDate and endDate parameters', function() {
        var mockTransactions = [{transactionId: 'T001', amount: 100}];
        var startDate = '2024-01-01';
        var endDate = '2024-01-31';

        $httpBackend.expectGET('/api/transactions?endDate=' + endDate + '&startDate=' + startDate).respond(200, mockTransactions);

        var result;
        TransactionService.getTransactions(startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should handle error when API call fails', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions').respond(500, 'Internal Server Error');

        var errorResult;
        TransactionService.getTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
      });

      it('should handle 404 not found error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/transactions').respond(404, 'Not Found');

        var errorResult;
        TransactionService.getTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getMockTransactions', function() {
      it('should return array of 600 mock transactions', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(600);
      });

      it('should return transactions with all required properties', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(transaction).toEqual(jasmine.objectContaining({
            transactionId: jasmine.any(String),
            cardId: jasmine.any(String),
            amount: jasmine.any(Number),
            date: jasmine.any(String),
            category: jasmine.any(String),
            merchantName: jasmine.any(String),
            description: jasmine.any(String)
          }));
        });
      });

      it('should return transactions with valid cardIds', function() {
        var result;
        var validCardIds = ['C001', 'C002', 'C003', 'C004', 'C005'];

        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(validCardIds).toContain(transaction.cardId);
        });
      });

      it('should return transactions with valid categories', function() {
        var result;
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(validCategories).toContain(transaction.category);
        });
      });

      it('should return transactions with valid amounts', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(transaction.amount).toBeGreaterThanOrEqual(10);
          expect(transaction.amount).toBeLessThanOrEqual(510);
        });
      });

      it('should return transactions with valid ISO date format', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(transaction.date).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
          var transDate = new Date(transaction.date);
          expect(transDate.toString()).not.toBe('Invalid Date');
        });
      });

      it('should return transactions spanning 12 months', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        var months = {};
        result.forEach(function(transaction) {
          var month = transaction.date.substring(0, 7);
          months[month] = true;
        });

        expect(Object.keys(months).length).toBe(12);
      });

      it('should return transactions with unique transaction IDs', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        var transactionIds = result.map(function(t) { return t.transactionId; });
        var uniqueIds = transactionIds.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });

        expect(uniqueIds.length).toBe(result.length);
      });

      it('should return transactions with valid merchant names', function() {
        var result;
        var validMerchants = ['Walmart', 'Amazon', 'Shell', 'Starbucks', 'Netflix', 'Electric Co', 'Hospital', 'University', 'Misc Store'];

        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        result.forEach(function(transaction) {
          expect(validMerchants).toContain(transaction.merchantName);
        });
      });

      it('should return transactions distributed across all 5 cards', function() {
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });

        var cardCounts = {};
        result.forEach(function(transaction) {
          cardCounts[transaction.cardId] = (cardCounts[transaction.cardId] || 0) + 1;
        });

        expect(Object.keys(cardCounts).length).toBe(5);
        Object.keys(cardCounts).forEach(function(cardId) {
          expect(cardCounts[cardId]).toBeGreaterThan(0);
        });
      });
    });
  });
})();