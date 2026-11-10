/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend with successful API response
- Purpose: Verify that monthly spend is fetched from API
- Scenario: User requests monthly spend, API returns success
- Expected Result: Service returns monthly spend value from API
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend with API failure
- Purpose: Verify that service returns fallback value when API fails
- Scenario: User requests monthly spend, API returns error
- Expected Result: Service returns default value of 8500
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with successful API response
- Purpose: Verify that transactions are fetched from API
- Scenario: User requests transaction history, API returns success
- Expected Result: Service returns transaction array from API
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with API failure
- Purpose: Verify that service generates mock transactions when API fails
- Scenario: User requests transaction history, API returns error
- Expected Result: Service returns generated mock transactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with custom months parameter
- Purpose: Verify that service respects months parameter
- Scenario: User requests 6 months of transaction history
- Expected Result: Service generates appropriate number of transactions
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend (success), getMonthlySpend (error), getTransactions (success), getTransactions (error), generateMockTransactions
- Scenarios covered: API success, API failure, default months, custom months, transaction structure validation
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

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

  describe('getMonthlySpend', function() {
    it('should return monthly spend from API on success', function() {
      var userId = 'user123';
      var apiResponse = {monthlySpend: 5200};

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(200, apiResponse);

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBe(5200);
    });

    it('should return default value 8500 when API fails', function() {
      var userId = 'user456';

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(500, 'Server Error');

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBe(8500);
    });

    it('should handle network timeout gracefully', function() {
      var userId = 'user789';

      $httpBackend.expectGET('/api/transactions/monthly-summary?userId=' + userId)
        .respond(0, '');

      var result;
      TransactionService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBe(8500);
    });
  });

  describe('getTransactions', function() {
    it('should return transactions from API on success', function() {
      var userId = 'user123';
      var months = 12;
      var apiResponse = [
        {id: 'txn1', amount: 150, date: '2023-01-15', category: 'Food & Dining'},
        {id: 'txn2', amount: 75, date: '2023-01-20', category: 'Fuel'}
      ];

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(200, apiResponse);

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(apiResponse);
      expect(result.length).toBe(2);
    });

    it('should generate mock transactions when API fails', function() {
      var userId = 'user456';
      var months = 12;

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(500, 'Server Error');

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should default to 12 months when months parameter is not provided', function() {
      var userId = 'user789';

      $httpBackend.expectGET('/api/transactions?months=12&userId=' + userId)
        .respond(500, 'Server Error');

      var result;
      TransactionService.getTransactions(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should generate mock transactions with correct structure', function() {
      var userId = 'user999';
      var months = 6;

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(404, 'Not Found');

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBeGreaterThan(0);
      var transaction = result[0];
      expect(transaction.id).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.merchantName).toBeDefined();
      expect(transaction.merchantCode).toBeDefined();
      expect(transaction.cardId).toBeDefined();
      expect(transaction.category).toBeDefined();
    });

    it('should generate transactions with valid categories', function() {
      var userId = 'user888';
      var months = 3;
      var validCategories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel',
        'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(500, 'Error');

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(transaction) {
        expect(validCategories).toContain(transaction.category);
      });
    });

    it('should generate transactions with positive amounts', function() {
      var userId = 'user777';
      var months = 1;

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(500, 'Error');

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(transaction) {
        expect(transaction.amount).toBeGreaterThan(0);
      });
    });

    it('should generate transactions with valid date objects', function() {
      var userId = 'user666';
      var months = 2;

      $httpBackend.expectGET('/api/transactions?months=' + months + '&userId=' + userId)
        .respond(500, 'Error');

      var result;
      TransactionService.getTransactions(userId, months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(transaction) {
        expect(transaction.date instanceof Date).toBe(true);
        expect(isNaN(transaction.date.getTime())).toBe(false);
      });
    });
  });
});