/*
Test Documentation:
- Test Name: kpi.service - getPortfolioKPIs
- Purpose: Validate portfolio KPI calculation (duplicate of dashboard.service, testing consistency)
- Scenario: Service aggregates card and transaction data for KPI display
- Expected Result: Returns consolidated portfolio metrics
*/

describe('KPIService (kpi.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIService;
  var CreditCardService;
  var TransactionService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_KPIService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
    KPIService = _KPIService_;
    CreditCardService = _CreditCardService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getPortfolioKPIs', function() {
    var mockCards;
    var mockTransactions;
    
    beforeEach(function() {
      mockCards = [
        {cardId: 'CC001', creditLimit: 10000, availableCredit: 7500, outstandingAmount: 2500},
        {cardId: 'CC002', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000}
      ];
      
      mockTransactions = [
        {transactionId: 'TX001', amount: 100},
        {transactionId: 'TX002', amount: 200}
      ];
    });
    
    it('should calculate all KPI metrics correctly', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      KPIService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.monthlySpend).toBe(300);
        expect(kpis.totalCreditLimit).toBe(25000);
        expect(kpis.totalAvailableCredit).toBe(19500);
        expect(kpis.totalOutstanding).toBe(5500);
        expect(kpis.cardCount).toBe(2);
        expect(kpis.lastUpdated).toBeDefined();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle zero values gracefully', function(done) {
      var emptyCards = [
        {cardId: 'CC001', creditLimit: 0, availableCredit: 0, outstandingAmount: 0}
      ];
      
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(emptyCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve([]));
      
      KPIService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.monthlySpend).toBe(0);
        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('Error'));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      KPIService.getPortfolioKPIs().catch(function(error) {
        expect(error).toBe('Error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getPortfolioKPIs
- Scenarios covered:
  * All KPI metrics calculation
  * Zero values handling
  * Service error handling
- Uncovered scenarios: None
- Edge cases: Zero values, service failures
*/