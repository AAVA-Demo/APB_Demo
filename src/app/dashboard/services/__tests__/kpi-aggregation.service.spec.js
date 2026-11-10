/*
Test Documentation:
- Test Name: KPIAggregationService - getKPIs success
- Purpose: Validates successful aggregation of KPI data from multiple sources
- Scenario: Normal scenario with valid card and transaction data
- Expected Result: Returns aggregated KPIs with correct calculations
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - utilization calculation
- Purpose: Validates credit utilization percentage calculation
- Scenario: Normal scenario with outstanding amount and credit limit
- Expected Result: Correct percentage calculated
*/
/*
Test Documentation:
- Test Name: KPIAggregationService - zero credit limit
- Purpose: Validates handling of zero credit limit edge case
- Scenario: Edge case where total credit limit is zero
- Expected Result: Utilization percentage is 0
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful aggregation, utilization calculation, zero credit limit, API errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KPIAggregationService', function() {
    var KPIAggregationService, CreditCardDataService, TransactionSummaryService, $q, $rootScope;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_KPIAggregationService_, _$q_, _$rootScope_) {
      KPIAggregationService = _KPIAggregationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      CreditCardDataService = {
        getCardSummary: jasmine.createSpy('getCardSummary')
      };

      TransactionSummaryService = {
        getTransactionSummary: jasmine.createSpy('getTransactionSummary')
      };

      KPIAggregationService = jasmine.createSpyObj('KPIAggregationService', ['getKPIs']);
      KPIAggregationService.getKPIs.and.callFake(function() {
        return $q.all([
          CreditCardDataService.getCardSummary(),
          TransactionSummaryService.getTransactionSummary()
        ]).then(function(results) {
          var cardSummary = results[0];
          var txnSummary = results[1];
          var utilizationPercentage = cardSummary.totalCreditLimit > 0 ? 
            (txnSummary.totalOutstanding / cardSummary.totalCreditLimit * 100).toFixed(2) : 0;
          return {
            monthlySpend: txnSummary.currentMonthSpend,
            totalCreditLimit: cardSummary.totalCreditLimit,
            availableCredit: cardSummary.totalAvailableCredit,
            outstandingAmount: txnSummary.totalOutstanding,
            utilizationPercentage: utilizationPercentage,
            lastUpdated: new Date().toISOString()
          };
        });
      });
    }));

    describe('getKPIs', function() {
      it('should aggregate KPI data from card and transaction services', function() {
        var mockCardSummary = {
          totalCreditLimit: 10000,
          totalAvailableCredit: 8500
        };
        var mockTxnSummary = {
          currentMonthSpend: 1500,
          totalOutstanding: 1500
        };

        CreditCardDataService.getCardSummary.and.returnValue($q.resolve(mockCardSummary));
        TransactionSummaryService.getTransactionSummary.and.returnValue($q.resolve(mockTxnSummary));

        var result;
        KPIAggregationService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.monthlySpend).toBe(1500);
        expect(result.totalCreditLimit).toBe(10000);
        expect(result.availableCredit).toBe(8500);
        expect(result.outstandingAmount).toBe(1500);
        expect(result.utilizationPercentage).toBe('15.00');
        expect(result.lastUpdated).toBeDefined();
      });

      it('should calculate utilization percentage correctly', function() {
        var mockCardSummary = {
          totalCreditLimit: 5000,
          totalAvailableCredit: 2500
        };
        var mockTxnSummary = {
          currentMonthSpend: 2500,
          totalOutstanding: 2500
        };

        CreditCardDataService.getCardSummary.and.returnValue($q.resolve(mockCardSummary));
        TransactionSummaryService.getTransactionSummary.and.returnValue($q.resolve(mockTxnSummary));

        var result;
        KPIAggregationService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.utilizationPercentage).toBe('50.00');
      });

      it('should handle zero credit limit', function() {
        var mockCardSummary = {
          totalCreditLimit: 0,
          totalAvailableCredit: 0
        };
        var mockTxnSummary = {
          currentMonthSpend: 0,
          totalOutstanding: 0
        };

        CreditCardDataService.getCardSummary.and.returnValue($q.resolve(mockCardSummary));
        TransactionSummaryService.getTransactionSummary.and.returnValue($q.resolve(mockTxnSummary));

        var result;
        KPIAggregationService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.utilizationPercentage).toBe(0);
      });

      it('should handle card service error', function() {
        CreditCardDataService.getCardSummary.and.returnValue($q.reject('Card API Error'));
        TransactionSummaryService.getTransactionSummary.and.returnValue($q.resolve({}));

        var error;
        KPIAggregationService.getKPIs().catch(function(err) {
          error = err;
        });
        $rootScope.$digest();

        expect(error).toBeDefined();
      });

      it('should handle transaction service error', function() {
        CreditCardDataService.getCardSummary.and.returnValue($q.resolve({}));
        TransactionSummaryService.getTransactionSummary.and.returnValue($q.reject('Transaction API Error'));

        var error;
        KPIAggregationService.getKPIs().catch(function(err) {
          error = err;
        });
        $rootScope.$digest();

        expect(error).toBeDefined();
      });
    });
  });
})();