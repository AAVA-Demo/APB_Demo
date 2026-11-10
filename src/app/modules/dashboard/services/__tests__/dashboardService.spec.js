/*
Test Documentation:
- Test Name: dashboardService - getKPIs success
- Purpose: Verify that getKPIs successfully aggregates KPI data from multiple sources
- Scenario: Credit cards and monthly spend data are retrieved successfully
- Expected Result: Promise resolves with aggregated KPI metrics
*/
/*
Test Documentation:
- Test Name: dashboardService - getKPIs error handling
- Purpose: Verify that getKPIs handles errors from underlying services
- Scenario: One or more data sources fail
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful aggregation, error handling, empty data, KPI calculations, null values
- Uncovered scenarios: none
*/

describe('dashboardService', function() {
  'use strict';

  var dashboardService;
  var creditCardFactory;
  var transactionFactory;
  var $q;
  var $rootScope;

  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_dashboardService_, _creditCardFactory_, _transactionFactory_, _$q_, _$rootScope_) {
    dashboardService = _dashboardService_;
    creditCardFactory = _creditCardFactory_;
    transactionFactory = _transactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getKPIs', function() {
    it('should successfully aggregate KPIs from cards and transactions', function() {
      var mockCards = [
        {
          cardId: 'card1',
          creditLimit: 5000,
          outstandingBalance: 1500,
          availableBalance: 3500
        },
        {
          cardId: 'card2',
          creditLimit: 10000,
          outstandingBalance: 2000,
          availableBalance: 8000
        }
      ];

      var mockMonthlySpend = {
        totalSpend: 3500
      };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(3500);
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.availableCredit).toBe(11500);
      expect(result.outstandingAmount).toBe(3500);
      expect(result.lastUpdated).toBeDefined();
    });

    it('should handle empty card array', function() {
      var emptyCards = [];
      var mockMonthlySpend = { totalSpend: 0 };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(emptyCards));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
    });

    it('should handle null or undefined card values', function() {
      var cardsWithNulls = [
        {
          cardId: 'card1',
          creditLimit: null,
          outstandingBalance: undefined,
          availableBalance: 3500
        }
      ];

      var mockMonthlySpend = { totalSpend: 100 };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(cardsWithNulls));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(3500);
    });

    it('should handle error from creditCardFactory', function() {
      var error = { message: 'Failed to fetch cards' };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.reject(error));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve({}));
      spyOn(console, 'error');

      var rejected = false;
      dashboardService.getKPIs().catch(function(err) {
        rejected = true;
      });

      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error computing KPIs:', error);
    });

    it('should handle error from transactionFactory', function() {
      var error = { message: 'Failed to fetch monthly spend' };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve([]));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.reject(error));
      spyOn(console, 'error');

      var rejected = false;
      dashboardService.getKPIs().catch(function(err) {
        rejected = true;
      });

      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle missing totalSpend in monthly data', function() {
      var mockCards = [{ creditLimit: 5000, outstandingBalance: 1000, availableBalance: 4000 }];
      var mockMonthlySpend = {};

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(0);
    });

    it('should set lastUpdated timestamp', function() {
      var mockCards = [];
      var mockMonthlySpend = { totalSpend: 0 };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.lastUpdated).toEqual(jasmine.any(Date));
    });

    it('should correctly sum multiple card values', function() {
      var mockCards = [
        { creditLimit: 1000, outstandingBalance: 100, availableBalance: 900 },
        { creditLimit: 2000, outstandingBalance: 200, availableBalance: 1800 },
        { creditLimit: 3000, outstandingBalance: 300, availableBalance: 2700 }
      ];

      var mockMonthlySpend = { totalSpend: 600 };

      spyOn(creditCardFactory, 'getCards').and.returnValue($q.resolve(mockCards));
      spyOn(transactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      dashboardService.getKPIs().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(6000);
      expect(result.outstandingAmount).toBe(600);
      expect(result.availableCredit).toBe(5400);
    });
  });
});