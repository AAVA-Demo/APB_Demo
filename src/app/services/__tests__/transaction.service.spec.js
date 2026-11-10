/*
Test Documentation:
- Test Name: TransactionService - fetchMonthlySpend
- Purpose: Validates retrieval of monthly spending total from API
- Scenario: Service makes HTTP GET request to monthly spend endpoint
- Expected Result: Returns numeric monthly spend value
*/
/*
Test Documentation:
- Test Name: TransactionService - fetchMonthlySpend error handling
- Purpose: Validates fallback to mock value when API fails
- Scenario: API request fails, service returns mock monthly spend
- Expected Result: Returns default value of 4850
*/
/*
Test Documentation:
- Test Name: TransactionService - fetchTransactions
- Purpose: Validates retrieval of transactions with optional date range filter
- Scenario: Service makes HTTP GET request with date range parameters
- Expected Result: Returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionService - fetchTransactions error handling
- Purpose: Validates fallback to mock transactions when API fails
- Scenario: API request fails, service generates mock transaction data
- Expected Result: Returns array of mock transactions across 12 months and 9 categories
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardSpending
- Purpose: Validates retrieval of card-specific spending data
- Scenario: Service fetches spending analysis for specific card ID
- Expected Result: Returns object with monthlySpend, categoryBreakdown, and recentTransactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getMockTransactions
- Purpose: Validates generation of mock transaction data for testing
- Scenario: Service generates 12 months of transactions across 9 categories
- Expected Result: Returns array of 108 transactions (12 months × 9 categories)
*/
/*
Coverage Report:
- Functions tested: fetchMonthlySpend, fetchTransactions, getCardSpending, getMockTransactions
- Scenarios covered: successful API calls, API error handling with mock data, date range filtering, card-specific spending, mock data generation
- Uncovered scenarios: invalid date range format, malformed API response, partial transaction data
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchMonthlySpend', function() {
      it('should fetch monthly spend from API successfully', function() {
        var mockResponse = {totalSpend: 5200};

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySpend).respond(200, mockResponse);

        var result;
        TransactionService.fetchMonthlySpend().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBe(5200);
      });

      it('should return 0 when API returns empty totalSpend', function() {
        var mockResponse = {};

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySpend).respond(200, mockResponse);

        var result;
        TransactionService.fetchMonthlySpend().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBe(0);
      });

      it('should return mock value 4850 when API call fails', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySpend).respond(500, 'Internal Server Error');

        var result;
        TransactionService.fetchMonthlySpend().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBe(4850);
      });
    });

    describe('fetchTransactions', function() {
      it('should fetch transactions from API successfully', function() {
        var mockTransactions = [
          {date: '2023-01-15', category: 'Food & Dining', amount: 100, merchant: 'Starbucks'},
          {date: '2023-01-20', category: 'Fuel', amount: 50, merchant: 'Shell Gas'}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions).respond(200, mockTransactions);

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
      });

      it('should include date range parameters when provided', function() {
        var dateRange = {startDate: '2023-01-01', endDate: '2023-01-31'};
        var mockTransactions = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?endDate=2023-01-31&startDate=2023-01-01').respond(200, mockTransactions);

        var result;
        TransactionService.fetchTransactions(dateRange).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should return mock transactions when API call fails', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions).respond(500);

        var result;
        TransactionService.fetchTransactions().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('getCardSpending', function() {
      it('should fetch card spending from API successfully', function() {
        var cardId = '1';
        var mockSpending = {
          cardId: '1',
          monthlySpend: 2000,
          categoryBreakdown: [
            {category: 'Food & Dining', amount: 500},
            {category: 'Fuel', amount: 300}
          ],
          recentTransactions: [
            {date: '2024-01-15', merchant: 'Starbucks', amount: 12.50, category: 'Food & Dining'}
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId).respond(200, mockSpending);

        var result;
        TransactionService.getCardSpending(cardId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toEqual(mockSpending);
        expect(result.cardId).toBe('1');
        expect(result.monthlySpend).toBe(2000);
      });

      it('should return mock spending data when API call fails', function() {
        var cardId = '2';
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=' + cardId).respond(404);

        var result;
        TransactionService.getCardSpending(cardId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.monthlySpend).toBeDefined();
        expect(result.categoryBreakdown).toBeDefined();
        expect(result.recentTransactions).toBeDefined();
        expect(Array.isArray(result.categoryBreakdown)).toBe(true);
        expect(Array.isArray(result.recentTransactions)).toBe(true);
      });
    });

    describe('getMockTransactions', function() {
      it('should generate mock transactions for 12 months and 9 categories', function() {
        var result = TransactionService.getMockTransactions();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(108);
      });

      it('should generate transactions with valid structure', function() {
        var result = TransactionService.getMockTransactions();

        result.forEach(function(txn) {
          expect(txn.date).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(typeof txn.amount).toBe('number');
          expect(txn.amount).toBeGreaterThanOrEqual(100);
          expect(txn.amount).toBeLessThanOrEqual(600);
        });
      });

      it('should generate transactions across all 9 categories', function() {
        var result = TransactionService.getMockTransactions();
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        categories.forEach(function(category) {
          var found = result.some(function(txn) {
            return txn.category === category;
          });
          expect(found).toBe(true);
        });
      });

      it('should generate transactions with dates in YYYY-MM-DD format', function() {
        var result = TransactionService.getMockTransactions();
        var datePattern = /^\d{4}-\d{2}-\d{2}$/;

        result.forEach(function(txn) {
          expect(datePattern.test(txn.date)).toBe(true);
        });
      });
    });
  });
})();