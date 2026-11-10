/*
Test Documentation:
- Test Name: KpiAggregationService Unit Tests
- Purpose: Validate KPI aggregation logic for dashboard metrics calculation
- Scenario: Tests cover KPI calculation from multiple cards and transactions including credit limits, outstanding amounts, and monthly spending
- Expected Result: Accurate KPI metrics aggregated from all data sources
*/

(function() {
  'use strict';

  describe('KpiAggregationService', function() {
    var KpiAggregationService, $q, $rootScope, CreditCardService, TransactionService;

    beforeEach(module('app.dashboard'));

    beforeEach(function() {
      CreditCardService = {
        getAllCards: jasmine.createSpy('getAllCards')
      };
      
      TransactionService = {
        getCurrentMonthTransactions: jasmine.createSpy('getCurrentMonthTransactions')
      };
      
      module(function($provide) {
        $provide.value('CreditCardService', CreditCardService);
        $provide.value('TransactionService', TransactionService);
      });
    });

    beforeEach(inject(function(_KpiAggregationService_, _$q_, _$rootScope_) {
      KpiAggregationService = _KpiAggregationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKpis', function() {
      it('should aggregate KPIs from multiple cards', function() {
        var mockCards = [
          { cardId: 'card-001', creditLimit: 50000, outstandingAmount: 15000 },
          { cardId: 'card-002', creditLimit: 30000, outstandingAmount: 8000 }
        ];
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, transactionType: 'Debit' },
          { transactionId: 'txn-002', amount: 1800, transactionType: 'Debit' }
        ];
        
        CreditCardService.getAllCards.and.returnValue($q.resolve(mockCards));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve(mockTransactions));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.totalCreditLimit).toBe(80000);
        expect(result.totalOutstanding).toBe(23000);
        expect(result.availableCredit).toBe(57000);
        expect(result.monthlySpend).toBe(4300);
        expect(result.lastUpdated).toBeDefined();
      });

      it('should handle empty cards array', function() {
        CreditCardService.getAllCards.and.returnValue($q.resolve([]));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve([]));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.monthlySpend).toBe(0);
      });

      it('should handle null values in card data', function() {
        var mockCards = [
          { cardId: 'card-001', creditLimit: null, outstandingAmount: null },
          { cardId: 'card-002', creditLimit: 30000, outstandingAmount: 8000 }
        ];
        var mockTransactions = [];
        
        CreditCardService.getAllCards.and.returnValue($q.resolve(mockCards));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve(mockTransactions));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.totalCreditLimit).toBe(30000);
        expect(result.totalOutstanding).toBe(8000);
      });

      it('should only count Debit transactions for monthly spend', function() {
        var mockCards = [{ cardId: 'card-001', creditLimit: 50000, outstandingAmount: 15000 }];
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 2500, transactionType: 'Debit' },
          { transactionId: 'txn-002', amount: 1000, transactionType: 'Credit' },
          { transactionId: 'txn-003', amount: 1800, transactionType: 'Debit' }
        ];
        
        CreditCardService.getAllCards.and.returnValue($q.resolve(mockCards));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve(mockTransactions));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.monthlySpend).toBe(4300);
      });

      it('should calculate available credit correctly', function() {
        var mockCards = [
          { cardId: 'card-001', creditLimit: 100000, outstandingAmount: 25000 },
          { cardId: 'card-002', creditLimit: 50000, outstandingAmount: 10000 }
        ];
        var mockTransactions = [];
        
        CreditCardService.getAllCards.and.returnValue($q.resolve(mockCards));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve(mockTransactions));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.availableCredit).toBe(115000);
      });

      it('should set lastUpdated timestamp', function() {
        var mockCards = [{ cardId: 'card-001', creditLimit: 50000, outstandingAmount: 15000 }];
        var mockTransactions = [];
        
        CreditCardService.getAllCards.and.returnValue($q.resolve(mockCards));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve(mockTransactions));
        
        var result;
        KpiAggregationService.getKpis().then(function(kpis) {
          result = kpis;
        });
        
        $rootScope.$digest();
        
        expect(result.lastUpdated).toEqual(jasmine.any(Date));
      });

      it('should handle service errors gracefully', function() {
        CreditCardService.getAllCards.and.returnValue($q.reject('Service error'));
        TransactionService.getCurrentMonthTransactions.and.returnValue($q.resolve([]));
        
        var error;
        KpiAggregationService.getKpis().catch(function(err) {
          error = err;
        });
        
        $rootScope.$digest();
        
        expect(error).toBeDefined();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getKpis
- Scenarios covered:
  * Multiple cards aggregation
  * Empty cards array
  * Null values in card data
  * Debit vs Credit transaction filtering
  * Available credit calculation
  * Timestamp generation
  * Service error handling
- Uncovered scenarios: None - all aggregation logic tested
- Edge cases: Empty arrays, null values, mixed transaction types, service failures
*/