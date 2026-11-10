/*
Test Documentation:
- Test Name: TransactionFactory Unit Tests
- Purpose: Validate getMonthlySpend, getCardSpend, and getTransactions methods for transaction data retrieval
- Scenario: Successful API retrieval, error handling, proper parameter formatting
- Expected Result: Resolved promises with correct data, proper error propagation on API failure
*/

describe('TransactionFactory', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var TransactionFactory, $httpBackend, $rootScope;

  beforeEach(inject(function(_TransactionFactory_, _$httpBackend_, _$rootScope_) {
    TransactionFactory = _TransactionFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $rootScope.apiBaseUrl = 'https://api.creditcard.example.com';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {

    it('should retrieve monthly spend successfully', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        { amount: 50.00 },
        { amount: 75.50 },
        { amount: 120.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(200, mockTransactions);

      var result;
      TransactionFactory.getMonthlySpend().then(function(total) {
        result = total;
      });

      $httpBackend.flush();

      expect(result).toBe(245.50);
    });

    it('should calculate total from transaction amounts', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [
        { amount: 100.00 },
        { amount: 200.00 },
        { amount: 300.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(200, mockTransactions);

      var result;
      TransactionFactory.getMonthlySpend().then(function(total) {
        result = total;
      });

      $httpBackend.flush();

      expect(result).toBe(600.00);
    });

    it('should return 0 for empty transactions', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockTransactions = [];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(200, mockTransactions);

      var result;
      TransactionFactory.getMonthlySpend().then(function(total) {
        result = total;
      });

      $httpBackend.flush();

      expect(result).toBe(0);
    });

    it('should handle API error', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(500, 'Server error');

      var error;
      TransactionFactory.getMonthlySpend().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should use current month as parameter', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(200, []);

      TransactionFactory.getMonthlySpend();

      $httpBackend.flush();
    });

    it('should return promise', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?month=' + currentMonth).respond(200, []);

      var promise = TransactionFactory.getMonthlySpend();

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

  });

  describe('getCardSpend', function() {

    it('should retrieve card spend for given card IDs', function() {
      var cardIds = [1, 2, 3];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 },
        { cardId: 2, monthlySpend: 1200.00 },
        { cardId: 3, monthlySpend: 800.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=1%2C2%2C3').respond(200, mockCardSpend);

      var result;
      TransactionFactory.getCardSpend(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCardSpend);
    });

    it('should format card IDs as comma-separated query parameter', function() {
      var cardIds = [10, 20];
      var mockCardSpend = [
        { cardId: 10, monthlySpend: 300.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=10%2C20').respond(200, mockCardSpend);

      TransactionFactory.getCardSpend(cardIds);

      $httpBackend.flush();
    });

    it('should handle single card ID', function() {
      var cardIds = [5];
      var mockCardSpend = [
        { cardId: 5, monthlySpend: 450.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=5').respond(200, mockCardSpend);

      var result;
      TransactionFactory.getCardSpend(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe(5);
    });

    it('should handle API error', function() {
      var cardIds = [1, 2];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=1%2C2').respond(500, 'Server error');

      var error;
      TransactionFactory.getCardSpend(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle empty card spend response', function() {
      var cardIds = [1, 2];
      var mockCardSpend = [];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=1%2C2').respond(200, mockCardSpend);

      var result;
      TransactionFactory.getCardSpend(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should return promise', function() {
      var cardIds = [1];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions/spend?cardIds=1').respond(200, []);

      var promise = TransactionFactory.getCardSpend(cardIds);

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

  });

  describe('getTransactions', function() {

    it('should retrieve transactions for given date range', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31')
      };
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 50.00 },
        { date: '2023-01-20', category: 'Fuel', amount: 60.00 }
      ];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?endDate=2023-01-31T00%3A00%3A00.000Z&startDate=2023-01-01T00%3A00%3A00.000Z').respond(200, mockTransactions);

      var result;
      TransactionFactory.getTransactions(dateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
    });

    it('should format date parameters as ISO strings', function() {
      var dateRange = {
        startDate: new Date('2023-06-15'),
        endDate: new Date('2023-06-30')
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?endDate=2023-06-30T00%3A00%3A00.000Z&startDate=2023-06-15T00%3A00%3A00.000Z').respond(200, []);

      TransactionFactory.getTransactions(dateRange);

      $httpBackend.flush();
    });

    it('should handle API error', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31')
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?endDate=2023-01-31T00%3A00%3A00.000Z&startDate=2023-01-01T00%3A00%3A00.000Z').respond(500, 'Server error');

      var error;
      TransactionFactory.getTransactions(dateRange).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle empty transactions response', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31')
      };
      var mockTransactions = [];

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?endDate=2023-01-31T00%3A00%3A00.000Z&startDate=2023-01-01T00%3A00%3A00.000Z').respond(200, mockTransactions);

      var result;
      TransactionFactory.getTransactions(dateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    it('should return promise', function() {
      var dateRange = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31')
      };

      $httpBackend.expectGET('https://api.creditcard.example.com/api/transactions?endDate=2023-01-31T00%3A00%3A00.000Z&startDate=2023-01-01T00%3A00%3A00.000Z').respond(200, []);

      var promise = TransactionFactory.getTransactions(dateRange);

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });

  });

});

/*
Coverage Report:
- Functions tested: getMonthlySpend, getCardSpend, getTransactions
- Scenarios covered:
  * getMonthlySpend:
    - Successful retrieval and total calculation
    - Sum calculation from transaction amounts
    - Empty transactions (return 0)
    - API error handling
    - Current month parameter usage
    - Promise return validation
  * getCardSpend:
    - Successful retrieval with multiple card IDs
    - Comma-separated query parameter formatting
    - Single card ID handling
    - API error handling
    - Empty response handling
    - Promise return validation
  * getTransactions:
    - Successful retrieval with date range
    - ISO string date parameter formatting
    - API error handling
    - Empty response handling
    - Promise return validation
- Uncovered scenarios: None - comprehensive coverage achieved
*/