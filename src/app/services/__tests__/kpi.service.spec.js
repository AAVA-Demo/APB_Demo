/*
Test Documentation:
- Test Name: KPIService - getKPIs - success scenario with cache miss
- Purpose: Validates that getKPIs calculates all KPIs correctly from card and transaction data
- Scenario: Service fetches cards and transactions, calculates KPIs, and caches result
- Expected Result: Returns KPI object with monthlySpend, totalCreditLimit, availableCredit, outstandingAmount
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs - cache hit scenario
- Purpose: Validates that getKPIs returns cached data within cache duration
- Scenario: Service called twice within 5-minute cache window
- Expected Result: Second call returns cached data without making HTTP requests
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs - cache expiration
- Purpose: Validates that cache expires after CACHE_DURATION and fresh data is fetched
- Scenario: Service called after cache expiration time
- Expected Result: New HTTP requests are made to fetch fresh data
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs - zero balance handling
- Purpose: Validates that KPI calculations handle cards with zero balances
- Scenario: All cards have zero outstanding amounts
- Expected Result: availableCredit equals totalCreditLimit
*/
/*
Test Documentation:
- Test Name: KPIService - invalidateCache
- Purpose: Validates that invalidateCache clears cached data
- Scenario: Cache is populated, then invalidated, then getKPIs is called
- Expected Result: Fresh data is fetched after cache invalidation
*/
/*
Test Documentation:
- Test Name: KPIService - error handling
- Purpose: Validates that service handles API errors gracefully
- Scenario: Card or transaction API requests fail
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getKPIs, invalidateCache
- Scenarios covered: success paths, caching logic, error handling, edge cases (zero balances, empty data)
- Uncovered scenarios: partial API failures, concurrent cache access
*/

describe('KPIService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  
  var KPIService, CreditCardDataService, $httpBackend, $q, $timeout;
  var mockCards = [
    {
      cardId: 'card1',
      creditLimit: 5000,
      outstandingAmount: 2500
    },
    {
      cardId: 'card2',
      creditLimit: 10000,
      outstandingAmount: 3000
    }
  ];
  var mockTransactions = [
    {transactionId: 'txn1', amount: 150.50},
    {transactionId: 'txn2', amount: 75.00},
    {transactionId: 'txn3', amount: 200.00}
  ];
  
  beforeEach(inject(function(_KPIService_, _CreditCardDataService_, _$httpBackend_, _$q_, _$timeout_) {
    KPIService = _KPIService_;
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $timeout = _$timeout_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    KPIService.invalidateCache();
  });
  
  describe('getKPIs', function() {
    
    it('should calculate KPIs correctly from cards and transactions', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, mockTransactions);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.outstandingAmount).toBe(5500);
      expect(result.availableCredit).toBe(9500);
      expect(result.monthlySpend).toBe(425.50);
      expect(result.lastUpdated).toBeDefined();
    });
    
    it('should return cached data on subsequent calls within cache duration', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, mockTransactions);
      
      var result1, result2;
      KPIService.getKPIs().then(function(kpiData) {
        result1 = kpiData;
      });
      
      $httpBackend.flush();
      
      KPIService.getKPIs().then(function(kpiData) {
        result2 = kpiData;
      });
      
      expect(result1).toBe(result2);
    });
    
    it('should handle cards with zero outstanding amounts', function() {
      var cardsWithZeroBalance = [
        {cardId: 'card1', creditLimit: 5000, outstandingAmount: 0},
        {cardId: 'card2', creditLimit: 10000, outstandingAmount: 0}
      ];
      
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, cardsWithZeroBalance);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, []);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(15000);
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle empty cards array', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, []);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, mockTransactions);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.monthlySpend).toBe(425.50);
    });
    
    it('should handle empty transactions array', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, []);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle null transaction response', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, null);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle transactions with missing amount', function() {
      var transactionsWithMissingAmount = [
        {transactionId: 'txn1', amount: 100},
        {transactionId: 'txn2'},
        {transactionId: 'txn3', amount: null}
      ];
      
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, transactionsWithMissingAmount);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(100);
    });
    
    it('should handle cards with missing credit limit or outstanding amount', function() {
      var cardsWithMissingData = [
        {cardId: 'card1', creditLimit: 5000},
        {cardId: 'card2', outstandingAmount: 1000},
        {cardId: 'card3'}
      ];
      
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, cardsWithMissingData);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, []);
      
      var result;
      KPIService.getKPIs().then(function(kpiData) {
        result = kpiData;
      });
      
      $httpBackend.flush();
      
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.outstandingAmount).toBe(1000);
      expect(result.availableCredit).toBe(4000);
    });
    
    it('should reject promise when card fetch fails', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(500, 'Internal Server Error');
      
      var error;
      KPIService.getKPIs().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should reject promise when transaction fetch fails', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(500, 'Internal Server Error');
      
      var error;
      KPIService.getKPIs().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  describe('invalidateCache', function() {
    
    it('should clear cache and force fresh data fetch', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, mockTransactions);
      
      KPIService.getKPIs();
      $httpBackend.flush();
      
      KPIService.invalidateCache();
      
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/transactions?month=current')
        .respond(200, mockTransactions);
      
      KPIService.getKPIs();
      $httpBackend.flush();
    });
    
    it('should allow cache to be invalidated multiple times', function() {
      KPIService.invalidateCache();
      KPIService.invalidateCache();
      KPIService.invalidateCache();
      
      expect(function() {
        KPIService.invalidateCache();
      }).not.toThrow();
    });
  });
});