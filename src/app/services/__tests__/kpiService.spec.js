/*
Test Documentation:
- Test Name: KPIService - getKPIData aggregates card and spend data
- Purpose: Validates KPI data aggregation from multiple sources
- Scenario: Service aggregates data from CreditCardService and TransactionService
- Expected Result: Should return aggregated KPI metrics
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData handles empty card data
- Purpose: Validates handling of empty or missing card data
- Scenario: CreditCardService returns empty card array
- Expected Result: Should return zero values for all metrics
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIData error handling
- Purpose: Validates error handling when dependencies fail
- Scenario: CreditCardService or TransactionService fails
- Expected Result: Should reject promise with error
*/
/*
Coverage Report:
- Functions tested: getKPIData
- Scenarios covered: successful aggregation, empty data handling, error handling, date formatting
- Edge cases: null card data, missing spend data, service failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, CreditCardService, TransactionService, $q, $rootScope;
    var mockUserId = 'user123';
    var mockCardData = {
      cards: [
        { cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 },
        { cardId: 'card2', creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000 }
      ]
    };
    var mockSpendData = {
      totalSpend: 1500
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
      KPIService = _KPIService_;
      CreditCardService = _CreditCardService_;
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      spyOn(CreditCardService, 'getCardBalances').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionService, 'getMonthlySpend').and.returnValue($q.resolve(mockSpendData));
    }));

    describe('getKPIData', function() {
      it('should aggregate KPI data from card and transaction services', function() {
        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(CreditCardService.getCardBalances).toHaveBeenCalledWith(mockUserId);
        expect(TransactionService.getMonthlySpend).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(1500);
        expect(result.totalCreditLimit).toBe(15000);
        expect(result.availableCredit).toBe(10000);
        expect(result.outstandingAmount).toBe(5000);
        expect(result.lastUpdated).toBeDefined();
      });

      it('should calculate correct totals for multiple cards', function() {
        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.totalCreditLimit).toBe(15000);
        expect(result.availableCredit).toBe(10000);
        expect(result.outstandingAmount).toBe(5000);
      });

      it('should handle empty card data gracefully', function() {
        CreditCardService.getCardBalances.and.returnValue($q.resolve({ cards: [] }));

        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.monthlySpend).toBe(1500);
      });

      it('should handle null card data', function() {
        CreditCardService.getCardBalances.and.returnValue($q.resolve(null));

        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle missing spend data', function() {
        TransactionService.getMonthlySpend.and.returnValue($q.resolve(null));

        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.monthlySpend).toBe(0);
      });

      it('should handle empty spend data object', function() {
        TransactionService.getMonthlySpend.and.returnValue($q.resolve({}));

        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.monthlySpend).toBe(0);
      });

      it('should handle CreditCardService errors', function() {
        CreditCardService.getCardBalances.and.returnValue($q.reject({ error: 'Service Error' }));

        var errorResult;
        KPIService.getKPIData(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $rootScope.$apply();

        expect(errorResult).toBeDefined();
      });

      it('should handle TransactionService errors', function() {
        TransactionService.getMonthlySpend.and.returnValue($q.reject({ error: 'Transaction Error' }));

        var errorResult;
        KPIService.getKPIData(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $rootScope.$apply();

        expect(errorResult).toBeDefined();
      });

      it('should include lastUpdated timestamp', function() {
        var beforeTime = new Date();
        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();
        var afterTime = new Date();

        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
        expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });

      it('should pass current month to TransactionService', function() {
        var currentMonth = new Date().toISOString().substring(0, 7);

        KPIService.getKPIData(mockUserId);
        $rootScope.$apply();

        expect(TransactionService.getMonthlySpend).toHaveBeenCalledWith(mockUserId, currentMonth);
      });

      it('should handle cards with missing optional fields', function() {
        var incompleteCardData = {
          cards: [
            { cardId: 'card1' },
            { cardId: 'card2', creditLimit: 5000 }
          ]
        };
        CreditCardService.getCardBalances.and.returnValue($q.resolve(incompleteCardData));

        var result;
        KPIService.getKPIData(mockUserId)
          .then(function(data) {
            result = data;
          });

        $rootScope.$apply();

        expect(result.totalCreditLimit).toBe(5000);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });
    });
  });
})();