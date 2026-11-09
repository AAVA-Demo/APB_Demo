/*
Test Documentation:
- Test Name: KpiService - getConsolidatedKpis success
- Purpose: Validates calculation of consolidated KPIs from card and transaction data
- Scenario: Service fetches cards and monthly spend, calculates aggregated metrics
- Expected Result: Returns KPI object with monthly spend, credit limits, available credit, outstanding amount, and utilization percentage
*/
/*
Test Documentation:
- Test Name: KpiService - getConsolidatedKpis with empty data
- Purpose: Validates KPI calculation with no cards or transactions
- Scenario: Service handles empty data gracefully
- Expected Result: Returns KPI object with zero values
*/
/*
Coverage Report:
- Functions tested: getConsolidatedKpis
- Scenarios covered: successful KPI calculation, empty cards, missing properties, error handling, utilization calculation
- Uncovered scenarios: none
*/

describe('KpiService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KpiService, CreditCardService, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_KpiService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
    KpiService = _KpiService_;
    CreditCardService = _CreditCardService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getConsolidatedKpis', function() {
    it('should calculate consolidated KPIs successfully', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000, currentBalance: 2500 },
        { cardId: 2, creditLimit: 15000, currentBalance: 5000 }
      ];
      var mockMonthlySpend = { totalSpend: 3200 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(CreditCardService.getAllCards).toHaveBeenCalled();
      expect(TransactionService.getMonthlySpend).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(3200);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.availableCredit).toBe(17500);
      expect(result.outstandingAmount).toBe(7500);
      expect(result.utilizationPercentage).toBe('30.00');
      expect(result.lastUpdated).toBeDefined();
    });
    
    it('should handle empty cards array', function() {
      var mockMonthlySpend = { totalSpend: 0 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.utilizationPercentage).toBe(0);
    });
    
    it('should handle missing monthly spend data', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000, currentBalance: 2500 }
      ];
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(null));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should handle cards with missing creditLimit or currentBalance', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000 },
        { cardId: 2, currentBalance: 2000 },
        { cardId: 3 }
      ];
      var mockMonthlySpend = { totalSpend: 500 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(10000);
      expect(result.outstandingAmount).toBe(2000);
      expect(result.availableCredit).toBe(8000);
    });
    
    it('should calculate utilization percentage correctly', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000, currentBalance: 5000 }
      ];
      var mockMonthlySpend = { totalSpend: 1000 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.utilizationPercentage).toBe('50.00');
    });
    
    it('should handle 100% utilization', function() {
      var mockCards = [
        { cardId: 1, creditLimit: 10000, currentBalance: 10000 }
      ];
      var mockMonthlySpend = { totalSpend: 2000 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.utilizationPercentage).toBe('100.00');
      expect(result.availableCredit).toBe(0);
    });
    
    it('should handle CreditCardService error', function() {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('Card API Error'));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve({ totalSpend: 0 }));
      
      var error;
      KpiService.getConsolidatedKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBeDefined();
    });
    
    it('should handle TransactionService error', function() {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.reject('Transaction API Error'));
      
      var error;
      KpiService.getConsolidatedKpis().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBeDefined();
    });
    
    it('should set lastUpdated timestamp', function() {
      var mockCards = [{ cardId: 1, creditLimit: 5000, currentBalance: 1000 }];
      var mockMonthlySpend = { totalSpend: 500 };
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      KpiService.getConsolidatedKpis().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
  });
});