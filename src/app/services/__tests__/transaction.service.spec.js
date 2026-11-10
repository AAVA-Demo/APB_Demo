/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate transaction fetching and mock data generation
- Scenario: Tests fetchTransactions with API success/failure, mock data structure
- Expected Result: Correct transaction data returned, proper mock generation with 50 transactions
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_ENDPOINTS;
    var mockTransactionsResponse;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_ENDPOINTS_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;

      mockTransactionsResponse = [
        {
          transactionId: 'tx001',
          cardId: 'card1',
          amount: 1250.50,
          category: 'Food & Dining',
          merchantName: 'Restaurant ABC',
          transactionDate: new Date('2026-11-01'),
          description: 'Dinner at Restaurant ABC'
        },
        {
          transactionId: 'tx002',
          cardId: 'card2',
          amount: 3500.00,
          category: 'Shopping',
          merchantName: 'Online Store',
          transactionDate: new Date('2026-11-05'),
          description: 'Online purchase'
        }
      ];
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchTransactions', function() {
      it('should fetch transactions from API successfully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.transactions).respond(200, mockTransactionsResponse);

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactionsResponse);
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('tx001');
        expect(result[0].amount).toBe(1250.50);
      });

      it('should return mock transactions when API call fails', function() {
        $httpBackend.expectGET(API_ENDPOINTS.transactions).respond(500, 'Server Error');

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(50);
      });

      it('should handle network timeout gracefully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.transactions).respond(0, '');

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(50);
      });

      it('should handle 404 error with mock data', function() {
        $httpBackend.expectGET(API_ENDPOINTS.transactions).respond(404, 'Not Found');

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(50);
      });
    });

    describe('_getMockTransactions', function() {
      it('should generate 50 mock transactions', function() {
        var mockTransactions = TransactionService._getMockTransactions();

        expect(mockTransactions).toEqual(jasmine.any(Array));
        expect(mockTransactions.length).toBe(50);
      });

      it('should generate transactions with all required fields', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var transaction = mockTransactions[0];

        expect(transaction.transactionId).toBeDefined();
        expect(transaction.cardId).toBeDefined();
        expect(transaction.amount).toBeDefined();
        expect(transaction.category).toBeDefined();
        expect(transaction.merchantName).toBeDefined();
        expect(transaction.transactionDate).toBeDefined();
        expect(transaction.description).toBeDefined();
      });

      it('should generate transactions with valid categories', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var validCategories = [
          'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
          'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
        ];

        mockTransactions.forEach(function(tx) {
          expect(validCategories).toContain(tx.category);
        });
      });

      it('should generate transactions with valid card IDs', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var validCardIds = ['card1', 'card2', 'card3', 'card4', 'card5'];

        mockTransactions.forEach(function(tx) {
          expect(validCardIds).toContain(tx.cardId);
        });
      });

      it('should generate transactions with amounts between 100 and 5100', function() {
        var mockTransactions = TransactionService._getMockTransactions();

        mockTransactions.forEach(function(tx) {
          expect(tx.amount).toBeGreaterThanOrEqual(100);
          expect(tx.amount).toBeLessThanOrEqual(5100);
        });
      });

      it('should generate transactions with amounts having 2 decimal places', function() {
        var mockTransactions = TransactionService._getMockTransactions();

        mockTransactions.forEach(function(tx) {
          var decimalPart = tx.amount.toString().split('.')[1];
          if (decimalPart) {
            expect(decimalPart.length).toBeLessThanOrEqual(2);
          }
        });
      });

      it('should generate transactions with dates within last 180 days', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var now = new Date();
        var sixMonthsAgo = new Date();
        sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

        mockTransactions.forEach(function(tx) {
          var txDate = new Date(tx.transactionDate);
          expect(txDate).toBeGreaterThanOrEqual(sixMonthsAgo);
          expect(txDate).toBeLessThanOrEqual(now);
        });
      });

      it('should generate unique transaction IDs', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var transactionIds = mockTransactions.map(function(tx) {
          return tx.transactionId;
        });

        var uniqueIds = transactionIds.filter(function(id, index) {
          return transactionIds.indexOf(id) === index;
        });

        expect(uniqueIds.length).toBe(50);
      });

      it('should match merchant names with categories', function() {
        var mockTransactions = TransactionService._getMockTransactions();
        var categoryMerchantMap = {
          'Food & Dining': 'Restaurant ABC',
          'Fuel': 'Gas Station XYZ',
          'Shopping': 'Online Store',
          'Travel': 'Airline Booking',
          'Entertainment': 'Movie Theater',
          'Utilities': 'Electric Company',
          'Healthcare': 'Hospital',
          'Education': 'University',
          'Miscellaneous': 'Misc Store'
        };

        mockTransactions.forEach(function(tx) {
          expect(tx.merchantName).toBe(categoryMerchantMap[tx.category]);
        });
      });

      it('should generate consistent descriptions', function() {
        var mockTransactions = TransactionService._getMockTransactions();

        mockTransactions.forEach(function(tx) {
          expect(tx.description).toContain('Transaction at');
          expect(tx.description).toContain(tx.merchantName);
        });
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: fetchTransactions, _getMockTransactions
  - Scenarios covered:
    * Successful API fetch
    * API failure with mock data fallback (500, 404, 0 errors)
    * Mock data generation (50 transactions)
    * Required field presence
    * Valid category validation
    * Valid card ID validation
    * Amount range validation (100-5100)
    * Decimal precision (2 places)
    * Date range validation (last 180 days)
    * Unique transaction ID generation
    * Category-merchant mapping
    * Description format validation
  - Edge cases: Network failures, various HTTP errors, data validation
  - Uncovered scenarios: Transaction filtering, sorting, pagination, real-time updates
  */
})();