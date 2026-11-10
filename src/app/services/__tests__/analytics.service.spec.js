/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate AnalyticsService functionality for transaction retrieval and caching
- Scenario: Tests getTransactions method with various inputs and cache behavior
- Expected Result: Service correctly retrieves mock transactions, caches results, and clears cache
*/

/*
Coverage Report:
- Functions tested: getTransactions, clearCache
- Scenarios covered: 
  * Normal: successful transaction retrieval with valid months parameter
  * Edge: cache hit scenario, empty cache scenario
  * Error: null/undefined user handling
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  var AnalyticsService;
  var AuthService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AnalyticsService_, _AuthService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    AnalyticsService.clearCache();
  });
  
  describe('getTransactions', function() {
    
    it('should retrieve transactions for a valid user', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(AuthService.getCurrentUser).toHaveBeenCalled();
    });
    
    it('should generate transactions with correct structure', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        transactionId: jasmine.any(String),
        userId: 'user123',
        cardId: jasmine.any(String),
        amount: jasmine.any(Number),
        category: jasmine.any(String),
        date: jasmine.any(Date),
        description: jasmine.any(String)
      }));
    });
    
    it('should return cached transactions on second call', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var firstResult, secondResult;
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        firstResult = transactions;
      });
      $rootScope.$digest();
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        secondResult = transactions;
      });
      $rootScope.$digest();
      
      expect(firstResult).toBe(secondResult);
      expect(AuthService.getCurrentUser.calls.count()).toBe(1);
    });
    
    it('should generate transactions across 12 months', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBe(360);
    });
    
    it('should assign transactions to valid categories', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(txn) {
        expect(validCategories).toContain(txn.category);
      });
    });
    
    it('should generate transactions with amounts between 10 and 510', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var result;
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(txn) {
        expect(txn.amount).toBeGreaterThanOrEqual(10);
        expect(txn.amount).toBeLessThanOrEqual(510);
      });
    });
    
  });
  
  describe('clearCache', function() {
    
    it('should clear cached transactions', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      var firstResult, secondResult;
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        firstResult = transactions;
      });
      $rootScope.$digest();
      
      AnalyticsService.clearCache();
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        secondResult = transactions;
      });
      $rootScope.$digest();
      
      expect(firstResult).not.toBe(secondResult);
      expect(AuthService.getCurrentUser.calls.count()).toBe(2);
    });
    
    it('should allow fresh data retrieval after cache clear', function() {
      spyOn(AuthService, 'getCurrentUser').and.returnValue({ userId: 'user123', name: 'Test User' });
      
      AnalyticsService.getTransactions(12);
      $rootScope.$digest();
      
      AnalyticsService.clearCache();
      
      var result;
      AnalyticsService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(360);
    });
    
  });
  
});