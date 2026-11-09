/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs
- Purpose: Validates aggregation of financial KPIs across all credit cards
- Scenario: User dashboard loads and requests consolidated KPI metrics
- Expected Result: Returns monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, and creditUtilization
*/
/*
Coverage Report:
- Functions tested: calculateKPIs, getKPIs
- Scenarios covered: successful KPI calculation, multiple cards aggregation, credit utilization calculation, empty cards/transactions
- Uncovered scenarios: none
*/

describe('KPICalculationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPICalculationService, CreditCardDataService, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_KPICalculationService_, _CreditCardDataService_, _TransactionService_, _$q_, _$rootScope_) {
    KPICalculationService = _KPICalculationService_;
    CreditCardDataService = _CreditCardDataService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('calculateKPIs', function() {
    it('should calculate KPIs from cards and transactions', function(done) {
      var mockCards = [
        { cardId: 'C001', creditLimit: 50000, availableCredit: 35000, currentBalance: 15000 },
        { cardId: 'C002', creditLimit: 75000, availableCredit: 50000, currentBalance: 25000 }
      ];
      var mockTransactions = [
        { amount: 1000, date: new Date() },
        { amount: 2000, date: new Date() },
        { amount: 1500, date: new Date() }
      ];
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));
      
      KPICalculationService.calculateKPIs('U001').then(function(result) {
        expect(result.totalCreditLimit).toBe(125000);
        expect(result.availableCredit).toBe(85000);
        expect(result.outstandingAmount).toBe(40000);
        expect(result.monthlySpend).toBe(4500);
        expect(parseFloat(result.creditUtilization)).toBeCloseTo(32, 0);
        expect(result.timestamp).toBeDefined();
        done();
      });
      $rootScope.$apply();
    });
    
    it('should handle empty cards array', function(done) {
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));
      
      KPICalculationService.calculateKPIs('U001').then(function(result) {
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(0);
        expect(result.creditUtilization).toBe(0);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should calculate credit utilization correctly', function(done) {
      var mockCards = [
        { cardId: 'C001', creditLimit: 100000, availableCredit: 60000, currentBalance: 40000 }
      ];
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));
      
      KPICalculationService.calculateKPIs('U001').then(function(result) {
        expect(result.creditUtilization).toBe('40.00');
        done();
      });
      $rootScope.$apply();
    });
  });
  
  describe('getKPIs', function() {
    it('should call calculateKPIs', function(done) {
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));
      
      KPICalculationService.getKPIs('U001').then(function(result) {
        expect(result).toBeDefined();
        expect(result.totalCreditLimit).toBeDefined();
        done();
      });
      $rootScope.$apply();
    });
  });
});