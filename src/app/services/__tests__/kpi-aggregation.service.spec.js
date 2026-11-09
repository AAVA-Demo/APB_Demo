/*
Test Documentation:
- Test Name: KPIAggregationService - getKPIs - aggregates KPIs from all cards
- Purpose: Validates that the service correctly aggregates financial metrics across all credit cards
- Scenario: User has multiple credit cards with various balances
- Expected Result: Service returns aggregated totals for monthly spend, credit limit, available credit, and outstanding amounts
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - getKPIs - calculates utilization rate correctly
- Purpose: Validates that credit utilization rate is calculated as percentage of outstanding vs credit limit
- Scenario: User has cards with known outstanding balances and credit limits
- Expected Result: Service returns correct utilization rate percentage
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - getKPIs - handles missing card data fields gracefully
- Purpose: Validates that service provides default values when card data is incomplete
- Scenario: API returns cards with missing financial fields
- Expected Result: Service treats missing values as zero and continues aggregation
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: multi-card aggregation, utilization calculation, missing data handling, zero values, API errors
- Uncovered scenarios: none
*/

describe('KPIAggregationService', function() {
  'use strict';
  
  var KPIAggregationService;
  var CreditCardService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_KPIAggregationService_, _CreditCardService_, _$q_, _$rootScope_) {
    KPIAggregationService = _KPIAggregationService_;
    CreditCardService = _CreditCardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getKPIs', function() {
    
    it('should aggregate KPIs from multiple credit cards', function() {
      var mockCards = [
        {cardId: '1', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000, currentMonthSpend: 1500},
        {cardId: '2', creditLimit: 15000, availableCredit: 10000, outstandingAmount: 5000, currentMonthSpend: 2500}
      ];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(4000);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.totalAvailableCredit).toBe(17000);
      expect(result.totalOutstanding).toBe(8000);
    });
    
    it('should calculate utilization rate correctly', function() {
      var mockCards = [
        {cardId: '1', creditLimit: 10000, outstandingAmount: 3000}
      ];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.utilizationRate).toBe('30.00');
    });
    
    it('should handle zero credit limit when calculating utilization rate', function() {
      var mockCards = [{cardId: '1', creditLimit: 0, outstandingAmount: 0}];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.utilizationRate).toBe(0);
    });
    
    it('should provide default values for missing card data fields', function() {
      var mockCards = [{cardId: '1', cardType: 'Visa'}];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });
    
    it('should include lastRefreshed timestamp in KPIs', function() {
      var mockCards = [];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var beforeTime = new Date();
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      var afterTime = new Date();
      
      expect(result.lastRefreshed).toBeDefined();
      expect(result.lastRefreshed.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(result.lastRefreshed.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
    
    it('should handle API errors and reject the promise', function() {
      var deferred = $q.defer();
      deferred.reject({message: 'Failed to fetch cards'});
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var error;
      KPIAggregationService.getKPIs().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to fetch cards');
    });
    
    it('should handle empty cards array', function() {
      var mockCards = [];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.utilizationRate).toBe(0);
    });
    
    it('should calculate utilization rate with high precision', function() {
      var mockCards = [
        {cardId: '1', creditLimit: 7500, outstandingAmount: 2345}
      ];
      var deferred = $q.defer();
      deferred.resolve(mockCards);
      spyOn(CreditCardService, 'fetchAllCards').and.returnValue(deferred.promise);
      
      var result;
      KPIAggregationService.getKPIs().then(function(kpis) {
        result = kpis;
      });
      $rootScope.$digest();
      
      expect(result.utilizationRate).toBe('31.27');
    });
  });
});