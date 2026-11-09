/*
Test Documentation:
- Test Name: KPIService - getKPIData
- Purpose: Validate aggregation of portfolio-level KPIs from card and transaction data
- Scenario: Service calculates monthly spend, credit limits, available credit, and outstanding amounts
- Expected Result: Returns consolidated KPI metrics across all user cards
*/

describe('KPIService', function() {
  'use strict';
  
  var KPIService;
  var CreditCardDataService;
  var TransactionProcessingService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_KPIService_, _CreditCardDataService_, _TransactionProcessingService_, _$q_, _$rootScope_) {
    KPIService = _KPIService_;
    CreditCardDataService = _CreditCardDataService_;
    TransactionProcessingService = _TransactionProcessingService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getKPIData', function() {
    var mockCards;
    var mockSpending;
    
    beforeEach(function() {
      mockCards = [
        {cardId: 'CC001', creditLimit: 10000, availableCredit: 7500, outstandingBalance: 2500},
        {cardId: 'CC002', creditLimit: 15000, availableCredit: 12000, outstandingBalance: 3000}
      ];
      
      mockSpending = {
        monthlySpend: 1500
      };
    });
    
    it('should calculate total credit limit correctly', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.totalCreditLimit).toBe(25000);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate total available credit correctly', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.availableCredit).toBe(19500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate total outstanding amount correctly', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.outstandingAmount).toBe(5500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include monthly spend in KPI data', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.monthlySpend).toBe(1500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include cards array in result', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.cards).toEqual(mockCards);
        expect(result.cards.length).toBe(2);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should include lastUpdated timestamp', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty card list', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve([]));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle missing spending data', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve({}));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).then(function(result) {
        expect(result.monthlySpend).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(CreditCardDataService, 'getCardDetails').and.returnValue($q.reject('Card service error'));
      spyOn(TransactionProcessingService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpending));
      
      var userId = 'USER001';
      
      KPIService.getKPIData(userId).catch(function(error) {
        expect(error).toBe('Card service error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getKPIData
- Scenarios covered:
  * Total credit limit calculation
  * Total available credit calculation
  * Total outstanding amount calculation
  * Monthly spend inclusion
  * Cards array inclusion
  * Timestamp generation
  * Empty card list
  * Missing spending data
  * Service error handling
- Uncovered scenarios: None
- Edge cases: Empty data, missing fields, service failures
*/