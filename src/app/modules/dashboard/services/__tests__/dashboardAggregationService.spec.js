/*
Test Documentation:
- Test Name: DashboardAggregationService Unit Tests
- Purpose: Validate dashboard data aggregation logic including KPI calculations and caching
- Scenario: Test getDashboardData with various card portfolios, cache behavior, and error handling
- Expected Result: Correct KPI aggregation, proper cache management, and error propagation
*/

describe('DashboardAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var DashboardAggregationService, CreditCardDataFactory, $q, $rootScope, $cacheFactory;
  var mockCards;
  
  beforeEach(inject(function(_DashboardAggregationService_, _CreditCardDataFactory_, _$q_, _$rootScope_, _$cacheFactory_) {
    DashboardAggregationService = _DashboardAggregationService_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
    
    mockCards = [
      {
        id: 'card1',
        cardName: 'Visa Gold',
        currentMonthSpend: 500,
        creditLimit: 5000,
        availableCredit: 4500,
        outstandingBalance: 500
      },
      {
        id: 'card2',
        cardName: 'Mastercard Platinum',
        currentMonthSpend: 300,
        creditLimit: 10000,
        availableCredit: 9700,
        outstandingBalance: 300
      }
    ];
  }));
  
  describe('getDashboardData', function() {
    it('should aggregate KPIs correctly from multiple cards', function(done) {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      
      DashboardAggregationService.getDashboardData('user123').then(function(result) {
        expect(result.kpis.monthlySpend).toBe(800);
        expect(result.kpis.totalCreditLimit).toBe(15000);
        expect(result.kpis.availableCredit).toBe(14200);
        expect(result.kpis.outstandingAmount).toBe(800);
        expect(result.cards).toEqual(mockCards);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle single card correctly', function(done) {
      var singleCard = [mockCards[0]];
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(singleCard));
      
      DashboardAggregationService.getDashboardData('user123').then(function(result) {
        expect(result.kpis.monthlySpend).toBe(500);
        expect(result.kpis.totalCreditLimit).toBe(5000);
        expect(result.kpis.availableCredit).toBe(4500);
        expect(result.kpis.outstandingAmount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty card array', function(done) {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve([]));
      
      DashboardAggregationService.getDashboardData('user123').then(function(result) {
        expect(result.kpis.monthlySpend).toBe(0);
        expect(result.kpis.totalCreditLimit).toBe(0);
        expect(result.kpis.availableCredit).toBe(0);
        expect(result.kpis.outstandingAmount).toBe(0);
        expect(result.cards).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should cache dashboard data', function(done) {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      
      DashboardAggregationService.getDashboardData('user123').then(function() {
        return DashboardAggregationService.getDashboardData('user123');
      }).then(function(result) {
        expect(CreditCardDataFactory.fetchAllCards.calls.count()).toBe(1);
        expect(result.kpis.monthlySpend).toBe(800);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should propagate errors from CreditCardDataFactory', function(done) {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.reject('API Error'));
      
      DashboardAggregationService.getDashboardData('user123').catch(function(error) {
        expect(error).toBe('API Error');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should call CreditCardDataFactory with correct userId', function() {
      spyOn(CreditCardDataFactory, 'fetchAllCards').and.returnValue($q.resolve(mockCards));
      
      DashboardAggregationService.getDashboardData('user456');
      
      expect(CreditCardDataFactory.fetchAllCards).toHaveBeenCalledWith('user456');
    });
  });
});

/*
Coverage Report:
- Functions tested: getDashboardData
- Scenarios covered:
  * Multiple cards aggregation
  * Single card handling
  * Empty card array
  * Cache hit scenario
  * Error propagation
  * Correct parameter passing
- Edge cases: Zero cards, cache behavior, error conditions
- Uncovered scenarios: Cache expiration after TTL, cache invalidation, concurrent requests
*/