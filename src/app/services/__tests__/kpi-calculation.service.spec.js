/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs success
- Purpose: Validates KPI calculation from card and transaction data
- Scenario: Valid card and transaction data available
- Expected Result: Returns calculated KPIs including monthly spend, credit limit, available credit, outstanding amount, and utilization
*/
/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs error handling
- Purpose: Validates error handling when data retrieval fails
- Scenario: CreditCardDataFactory rejects promise
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: KPICalculationService - credit utilization calculation
- Purpose: Validates credit utilization percentage calculation
- Scenario: Known credit limit and outstanding balance
- Expected Result: Correct utilization percentage
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: successful calculation, error handling, utilization calculation, zero credit limit edge case
- Uncovered scenarios: none
*/

describe('KPICalculationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPICalculationService;
  var $q;
  var $rootScope;
  var CreditCardDataFactory;
  var TransactionFactory;
  
  beforeEach(inject(function(_KPICalculationService_, _$q_, _$rootScope_, _CreditCardDataFactory_, _TransactionFactory_) {
    KPICalculationService = _KPICalculationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    TransactionFactory = _TransactionFactory_;
  }));
  
  describe('calculateKPIs', function() {
    it('should calculate KPIs successfully', function() {
      var mockCards = [
        {creditLimit: 10000, currentBalance: 3000},
        {creditLimit: 15000, currentBalance: 5000}
      ];
      var mockTransactions = {
        monthlySpend: 2000,
        outstandingAmount: 8000
      };
      
      spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionFactory, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      KPICalculationService.calculateKPIs().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.outstandingAmount).toBe(8000);
      expect(result.availableCredit).toBe(17000);
      expect(result.monthlySpend).toBe(2000);
      expect(result.creditUtilization).toBe('32.00');
      expect(result.lastUpdated).toBeDefined();
    });
    
    it('should handle zero credit limit', function() {
      var mockCards = [];
      var mockTransactions = {monthlySpend: 0, outstandingAmount: 0};
      
      spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionFactory, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      KPICalculationService.calculateKPIs().then(function(kpis) {
        result = kpis;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.creditUtilization).toBe(0);
    });
    
    it('should reject promise when CreditCardDataFactory fails', function() {
      var errorMessage = 'Failed to retrieve cards';
      spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.reject(errorMessage));
      spyOn(TransactionFactory, 'getMonthlyTransactions').and.returnValue($q.resolve({}));
      
      var error;
      KPICalculationService.calculateKPIs().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should reject promise when TransactionFactory fails', function() {
      var errorMessage = 'Failed to retrieve transactions';
      spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionFactory, 'getMonthlyTransactions').and.returnValue($q.reject(errorMessage));
      
      var error;
      KPICalculationService.calculateKPIs().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should return a promise', function() {
      spyOn(CreditCardDataFactory, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionFactory, 'getMonthlyTransactions').and.returnValue($q.resolve({}));
      
      var promise = KPICalculationService.calculateKPIs();
      
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
});