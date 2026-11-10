/*
Test Documentation:
- Test Name: analyticsService - getTransactions
- Purpose: Validates that getTransactions retrieves transaction data after authentication
- Scenario: When getTransactions is called, it should authenticate and return transactions
- Expected Result: Returns a promise that resolves with an array of transaction objects
*/
/*
Test Documentation:
- Test Name: analyticsService - getTransactions with parameters
- Purpose: Validates that getTransactions accepts userId and dateRange parameters
- Scenario: When getTransactions is called with userId and dateRange, it should return filtered transactions
- Expected Result: Returns transactions (filtering not implemented in mock, but parameters are accepted)
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful transaction retrieval with authentication, promise resolution, parameter acceptance
- Edge cases: authentication flow, promise chaining, parameter handling
- Uncovered scenarios: dateRange filtering (not implemented in mock service)
*/

describe('analyticsService', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  beforeEach(module('creditCardApp'));
  
  var analyticsService;
  var authService;
  var mockDataService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_analyticsService_, _authService_, _mockDataService_, _$q_, _$rootScope_) {
    analyticsService = _analyticsService_;
    authService = _authService_;
    mockDataService = _mockDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getTransactions', function() {
    it('should be defined', function() {
      expect(analyticsService.getTransactions).toBeDefined();
      expect(typeof analyticsService.getTransactions).toBe('function');
    });
    
    it('should return a promise', function() {
      var result = analyticsService.getTransactions('user123', null);
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should call authService.getAuthToken', function(done) {
      spyOn(authService, 'getAuthToken').and.callThrough();
      analyticsService.getTransactions('user123', null).then(function() {
        expect(authService.getAuthToken).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should resolve with array of transactions', function(done) {
      analyticsService.getTransactions('user123', null).then(function(transactions) {
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBe(10);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return transactions with required properties', function(done) {
      analyticsService.getTransactions('user123', null).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.description).toBeDefined();
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should call mockDataService.getTransactions', function(done) {
      spyOn(mockDataService, 'getTransactions').and.callThrough();
      analyticsService.getTransactions('user123', null).then(function() {
        expect(mockDataService.getTransactions).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should accept userId parameter', function(done) {
      analyticsService.getTransactions('testUser', null).then(function(transactions) {
        expect(transactions).toBeDefined();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should accept dateRange parameter', function(done) {
      var dateRange = {start: '2024-01-01', end: '2024-12-31'};
      analyticsService.getTransactions('user123', dateRange).then(function(transactions) {
        expect(transactions).toBeDefined();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should handle null dateRange', function(done) {
      analyticsService.getTransactions('user123', null).then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return transactions with valid categories', function(done) {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      analyticsService.getTransactions('user123', null).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('service dependencies', function() {
    it('should have authService injected', function() {
      expect(authService).toBeDefined();
    });
    
    it('should have mockDataService injected', function() {
      expect(mockDataService).toBeDefined();
    });
  });
});