/*
Test Documentation:
- Test Name: DashboardService - getKPIs
- Purpose: Validates aggregation of KPI data from multiple sources
- Scenario: Combines card data and transaction data to calculate KPIs
- Expected Result: Returns object with monthlySpend, totalCreditLimit, totalAvailableCredit, totalOutstanding, cards
*/
/*
Test Documentation:
- Test Name: DashboardService - getKPIs with multiple cards
- Purpose: Validates correct calculation of totals across multiple cards
- Scenario: Multiple cards with different limits and balances
- Expected Result: Correct aggregated totals
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: single card, multiple cards, aggregation logic, error handling
- Uncovered scenarios: none
*/

describe('DashboardService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var DashboardService, CreditCardDataService, TransactionProcessingService, $q, $rootScope;
  
  beforeEach(inject(function(_DashboardService_, _CreditCardDataService_, _TransactionProcessingService_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
    CreditCardDataService = _CreditCardDataService_;
    TransactionProcessingService = _TransactionProcessingService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getKPIs', function() {
    it('should calculate KPIs correctly with single card', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa', creditLimit: 5000, availableCredit: 3000, currentBalance: 2000 }
      ];
      var mockMonthlySpend = 1500;
      
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getCurrentMonthSpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      DashboardService.getKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(1500);
      expect(result.totalCreditLimit).toBe(5000);
      expect(result.totalAvailableCredit).toBe(3000);
      expect(result.totalOutstanding).toBe(2000);
      expect(result.cards.length).toBe(1);
    });
    
    it('should calculate KPIs correctly with multiple cards', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa', creditLimit: 5000, availableCredit: 3000, currentBalance: 2000 },
        { cardId: 2, cardName: 'MasterCard', creditLimit: 10000, availableCredit: 7000, currentBalance: 3000 },
        { cardId: 3, cardName: 'Amex', creditLimit: 15000, availableCredit: 12000, currentBalance: 3000 }
      ];
      var mockMonthlySpend = 2500;
      
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getCurrentMonthSpend').and.returnValue($q.resolve(mockMonthlySpend));
      
      var result;
      DashboardService.getKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlySpend).toBe(2500);
      expect(result.totalCreditLimit).toBe(30000);
      expect(result.totalAvailableCredit).toBe(22000);
      expect(result.totalOutstanding).toBe(8000);
      expect(result.cards.length).toBe(3);
    });
    
    it('should handle empty card list', function() {
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionProcessingService, 'getCurrentMonthSpend').and.returnValue($q.resolve(0));
      
      var result;
      DashboardService.getKPIs().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.cards.length).toBe(0);
    });
    
    it('should handle service errors', function() {
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.reject('Card Service Error'));
      spyOn(TransactionProcessingService, 'getCurrentMonthSpend').and.returnValue($q.resolve(0));
      
      var errorResult;
      DashboardService.getKPIs().catch(function(error) {
        errorResult = error;
      });
      
      $rootScope.$digest();
      
      expect(errorResult).toBe('Card Service Error');
    });
  });
});