/*
Test Documentation:
- Test Name: KpiAggregationService Unit Tests
- Purpose: Validate KPI data aggregation from credit cards and transactions
- Scenario: Test getKpiData method with mocked dependencies
- Expected Result: Accurate KPI calculations for monthly spend, credit limits, and balances
*/

describe('KpiAggregationService', function() {
  'use strict';
  
  var KpiAggregationService, CreditCardFactory, TransactionFactory, $q, $rootScope;
  
  beforeEach(module('dashboardModule'));
  
  beforeEach(inject(function(_KpiAggregationService_, _$q_, _$rootScope_) {
    KpiAggregationService = _KpiAggregationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    CreditCardFactory = {
      getAllCards: jasmine.createSpy('getAllCards').and.returnValue($q.resolve([]))
    };
    
    TransactionFactory = {
      getMonthlyTransactions: jasmine.createSpy('getMonthlyTransactions').and.returnValue($q.resolve([]))
    };
    
    KpiAggregationService.__set__('CreditCardFactory', CreditCardFactory);
    KpiAggregationService.__set__('TransactionFactory', TransactionFactory);
  }));
  
  describe('getKpiData', function() {
    it('should aggregate KPI data from cards and transactions', function() {
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, outstandingBalance: 1500},
        {cardId: 'card2', creditLimit: 10000, outstandingBalance: 3000}
      ];
      var mockTransactions = [
        {transactionId: 't1', amount: 150},
        {transactionId: 't2', amount: 200}
      ];
      
      CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
      TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
      
      var result;
      KpiAggregationService.getKpiData().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.outstandingAmount).toBe(4500);
      expect(result.availableCredit).toBe(10500);
      expect(result.monthlySpend).toBe(350);
    });
    
    it('should handle empty cards and transactions', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));
      TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve([]));
      
      var result;
      KpiAggregationService.getKpiData().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });
    
    it('should include lastUpdated timestamp', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));
      TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve([]));
      
      var result;
      KpiAggregationService.getKpiData().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
    
    it('should reject on CreditCardFactory error', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.reject('Card Error'));
      
      var error;
      KpiAggregationService.getKpiData().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card Error');
    });
    
    it('should reject on TransactionFactory error', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));
      TransactionFactory.getMonthlyTransactions.and.returnValue($q.reject('Transaction Error'));
      
      var error;
      KpiAggregationService.getKpiData().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Transaction Error');
    });
  });
});

/*
Coverage Report:
- Functions tested: getKpiData
- Scenarios covered:
  * KPI aggregation from multiple sources
  * Empty data handling
  * Timestamp inclusion
  * Error handling from dependencies
- Uncovered scenarios: None
*/