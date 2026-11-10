/*
Test Documentation:
- Test Name: KPIAggregationService - fetchKPIs success
- Purpose: Verify service aggregates KPI data from multiple sources
- Scenario: Card balances and monthly spend data available
- Expected Result: Returns complete KPI object with calculations
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - fetchKPIs with cache
- Purpose: Verify service returns cached KPIs when cache is valid
- Scenario: KPIs cached within 30 seconds
- Expected Result: Returns cached data without calling dependencies
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - utilization rate calculation
- Purpose: Verify correct calculation of credit utilization rate
- Scenario: Cards with varying credit limits and usage
- Expected Result: Accurate percentage calculation
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - zero credit limit handling
- Purpose: Verify service handles edge case of zero total credit
- Scenario: No cards or all cards have zero limit
- Expected Result: Utilization rate is 0, no division by zero error
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - multiple cards aggregation
- Purpose: Verify service correctly sums values across multiple cards
- Scenario: Multiple cards with different balances
- Expected Result: Accurate totals for all KPI metrics
*/
/*
Coverage Report:
- Functions tested: fetchKPIs
- Scenarios covered: successful aggregation, cache hit, utilization calculation, zero credit, multiple cards
- Uncovered scenarios: partial data failure, concurrent fetch requests
*/

describe('KPIAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIAggregationService, CardDataService, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_KPIAggregationService_, _CardDataService_, _TransactionService_, _$q_, _$rootScope_) {
    KPIAggregationService = _KPIAggregationService_;
    CardDataService = _CardDataService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('fetchKPIs', function() {
    it('should aggregate KPIs from card balances and transactions', function() {
      var mockBalances = [
        {
          cardId: 'card1',
          creditLimit: 50000,
          availableCredit: 35000,
          outstandingAmount: 15000
        },
        {
          cardId: 'card2',
          creditLimit: 30000,
          availableCredit: 25000,
          outstandingAmount: 5000
        }
      ];
      var mockMonthlySpend = 28500;
      
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(28500);
      expect(result.totalCreditLimit).toBe(80000);
      expect(result.availableCredit).toBe(60000);
      expect(result.outstandingAmount).toBe(20000);
      expect(result.utilizationRate).toBe('25.00');
      expect(result.lastRefreshed).toBeDefined();
    });
    
    it('should calculate utilization rate correctly', function() {
      var mockBalances = [
        {
          cardId: 'card1',
          creditLimit: 100000,
          availableCredit: 30000,
          outstandingAmount: 70000
        }
      ];
      
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(50000));
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result.utilizationRate).toBe('70.00');
    });
    
    it('should handle zero credit limit without error', function() {
      var mockBalances = [
        {
          cardId: 'card1',
          creditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0
        }
      ];
      
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(0));
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result.utilizationRate).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
    });
    
    it('should return cached data when cache is valid', function() {
      var mockBalances = [{ cardId: 'card1', creditLimit: 50000, availableCredit: 40000, outstandingAmount: 10000 }];
      
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(15000));
      
      KPIAggregationService.fetchKPIs();
      $rootScope.$apply();
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      expect(CardDataService.getCardBalances.calls.count()).toBe(1);
      expect(TransactionService.getMonthlySpend.calls.count()).toBe(1);
    });
    
    it('should aggregate multiple cards correctly', function() {
      var mockBalances = [
        { cardId: 'card1', creditLimit: 20000, availableCredit: 15000, outstandingAmount: 5000 },
        { cardId: 'card2', creditLimit: 30000, availableCredit: 20000, outstandingAmount: 10000 },
        { cardId: 'card3', creditLimit: 50000, availableCredit: 40000, outstandingAmount: 10000 }
      ];
      
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(30000));
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result.totalCreditLimit).toBe(100000);
      expect(result.availableCredit).toBe(75000);
      expect(result.outstandingAmount).toBe(25000);
    });
    
    it('should handle empty card list', function() {
      spyOn(CardDataService, 'getCardBalances').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(0));
      
      var result;
      KPIAggregationService.fetchKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$apply();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
    });
  });
});