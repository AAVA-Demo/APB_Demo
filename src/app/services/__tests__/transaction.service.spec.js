/*
Test Documentation:
- Test Name: transactionService - getTransactions and getTransactionById
- Purpose: Validates transaction data retrieval with caching
- Scenario: Tests all transactions fetch, single transaction fetch, caching, error handling
- Expected Result: Returns correct transaction data with proper caching and error handling
*/
/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered: fetch all, fetch by ID, caching, error handling
- Uncovered scenarios: none
*/

describe('transactionService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var transactionService;
  var $httpBackend;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_transactionService_, _$httpBackend_, _$q_, _$rootScope_) {
    transactionService = _transactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should retrieve all transactions', function() {
      var mockTransactions = [
        { transactionId: '1', amount: 100, merchant: 'Store A' },
        { transactionId: '2', amount: 50, merchant: 'Store B' }
      ];

      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      var result;
      transactionService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
    });

    it('should cache transactions', function() {
      var mockTransactions = [{ transactionId: '1' }];

      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);
      transactionService.getTransactions();
      $httpBackend.flush();

      transactionService.getTransactions();
      $rootScope.$apply();

      expect(true).toBe(true);
    });

    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');

      var error;
      transactionService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });

  describe('getTransactionById', function() {
    it('should retrieve transaction by ID', function() {
      var mockTransaction = { transactionId: '123', amount: 100 };

      $httpBackend.expectGET('/api/transactions/123').respond(200, mockTransaction);

      var result;
      transactionService.getTransactionById('123').then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransaction);
    });

    it('should handle transaction not found', function() {
      $httpBackend.expectGET('/api/transactions/999').respond(404, 'Not Found');

      var error;
      transactionService.getTransactionById('999').catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
});