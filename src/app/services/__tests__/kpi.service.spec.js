/*
Test Documentation:
- Test Name: KPIService - getKPIs
- Purpose: Validates computation of key performance indicators from credit card and transaction data
- Scenario: Service fetches cards and monthly spend, then computes totalCreditLimit, outstandingAmount, availableCredit, and monthlySpend
- Expected Result: Returns KPI object with monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, and lastUpdated timestamp
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs with multiple cards
- Purpose: Validates correct aggregation of credit limits and balances across multiple cards
- Scenario: Service aggregates data from multiple credit cards
- Expected Result: Returns correct sum of credit limits and balances
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs error handling
- Purpose: Validates KPI computation when service dependencies fail
- Scenario: CreditCardService or TransactionService fails
- Expected Result: Promise rejection or fallback to default values
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful KPI computation, multiple card aggregation, credit limit and balance calculations, available credit computation, lastUpdated timestamp generation
- Uncovered scenarios: partial service failures, negative balance handling, zero credit limit edge case
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardService, TransactionService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
      KPIService = _KPIService_;
      CreditCardService = _CreditCardService_;
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getKPIs', function() {
      it('should compute KPIs from cards and monthly spend', function() {
        var mockCards = [
          {cardId: '1', creditLimit: 5000, currentBalance: 1200},
          {cardId: '2', creditLimit: 8000, currentBalance: 2500},
          {cardId: '3', creditLimit: 10000, currentBalance: 3000}
        ];
        var mockMonthlySpend = 4850;

        spyOn(CreditCardService, 'fetchCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'fetchMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(CreditCardService.fetchCards).toHaveBeenCalled();
        expect(TransactionService.fetchMonthlySpend).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(4850);
        expect(result.totalCreditLimit).toBe(23000);
        expect(result.outstandingAmount).toBe(6700);
        expect(result.availableCredit).toBe(16300);
        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
      });

      it('should handle single card correctly', function() {
        var mockCards = [
          {cardId: '1', creditLimit: 5000, currentBalance: 1200}
        ];
        var mockMonthlySpend = 1200;

        spyOn(CreditCardService, 'fetchCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'fetchMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.totalCreditLimit).toBe(5000);
        expect(result.outstandingAmount).toBe(1200);
        expect(result.availableCredit).toBe(3800);
        expect(result.monthlySpend).toBe(1200);
      });

      it('should handle empty cards array', function() {
        var mockCards = [];
        var mockMonthlySpend = 0;

        spyOn(CreditCardService, 'fetchCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'fetchMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.monthlySpend).toBe(0);
      });

      it('should compute available credit correctly', function() {
        var mockCards = [
          {cardId: '1', creditLimit: 10000, currentBalance: 2500},
          {cardId: '2', creditLimit: 5000, currentBalance: 1000}
        ];
        var mockMonthlySpend = 3500;

        spyOn(CreditCardService, 'fetchCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'fetchMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var expectedAvailableCredit = (10000 + 5000) - (2500 + 1000);
        expect(result.availableCredit).toBe(expectedAvailableCredit);
        expect(result.availableCredit).toBe(11500);
      });

      it('should set lastUpdated to current date', function() {
        var mockCards = [{cardId: '1', creditLimit: 5000, currentBalance: 1200}];
        var mockMonthlySpend = 1200;

        spyOn(CreditCardService, 'fetchCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'fetchMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

        var beforeCall = new Date();
        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });
        $rootScope.$digest();
        var afterCall = new Date();

        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
        expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterCall.getTime());
      });
    });
  });
})();