/*
Test Documentation:
- Test Name: dashboard.service - getPortfolioKPIs
- Purpose: Validate portfolio-level KPI aggregation for dashboard display
- Scenario: Service calculates consolidated metrics across all cards
- Expected Result: Returns monthly spend, credit limits, available credit, and outstanding amounts
*/

describe('DashboardService (dashboard.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DashboardService;
  var CreditCardService;
  var TransactionService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_DashboardService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
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
        {transactionId: 'TX002', amount: 200},
        {transactionId: 'TX003', amount: 150}
      ];
    });
    
    it('should calculate total credit limit', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.totalCreditLimit).toBe(25000);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate total available credit', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.totalAvailableCredit).toBe(19500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate total outstanding amount', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.totalOutstanding).toBe(5500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate monthly spend', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.monthlySpend).toBe(450);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include card count', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.cardCount).toBe(2);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include lastUpdated timestamp', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.lastUpdated).toBeDefined();
        expect(kpis.lastUpdated instanceof Date).toBe(true);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty card list', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.totalCreditLimit).toBe(0);
        expect(kpis.totalAvailableCredit).toBe(0);
        expect(kpis.totalOutstanding).toBe(0);
        expect(kpis.cardCount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve([]));
      
      DashboardService.getPortfolioKPIs().then(function(kpis) {
        expect(kpis.monthlySpend).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(CreditCardService, 'getAllCards').and.returnValue($q.reject('Service error'));
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.returnValue($q.resolve(mockTransactions));
      
      DashboardService.getPortfolioKPIs().catch(function(error) {
        expect(error).toBe('Service error');
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
  * Total credit limit calculation
  * Total available credit calculation
  * Total outstanding amount calculation
  * Monthly spend calculation
  * Card count
  * Timestamp generation
  * Empty card list
  * Empty transaction list
  * Service error handling
- Uncovered scenarios: None
- Edge cases: Empty data, service failures
*/