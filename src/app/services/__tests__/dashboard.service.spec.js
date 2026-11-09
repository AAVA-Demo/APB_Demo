/*
Test Documentation:
- Test Name: DashboardService - getKPIs
- Purpose: Validates that KPIs are correctly calculated from credit card and transaction data
- Scenario: Multiple credit cards with various limits and outstanding amounts
- Expected Result: Returns KPI object with correct monthly spend, total credit limit, available credit, and outstanding amount
*/
/*
Test Documentation:
- Test Name: DashboardService - error handling
- Purpose: Validates proper error handling when dependencies fail
- Scenario: CreditCardFactory or TransactionFactory rejects promise
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful KPI calculation, empty cards, null values, error handling, date timestamp
- Uncovered scenarios: none
*/

describe('DashboardService', function() {
  'use strict';

  beforeEach(module('app.dashboard'));

  var DashboardService, CreditCardFactory, TransactionFactory, $q, $rootScope;

  beforeEach(inject(function(_DashboardService_, _CreditCardFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
    CreditCardFactory = _CreditCardFactory_;
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getKPIs', function() {
    var mockCards, mockMonthlySpend;

    beforeEach(function() {
      mockCards = [
        { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 10000, outstandingAmount: 2000 },
        { cardId: 'card2', cardName: 'Mastercard Platinum', creditLimit: 15000, outstandingAmount: 5000 },
        { cardId: 'card3', cardName: 'Amex Blue', creditLimit: 8000, outstandingAmount: 1500 }
      ];

      mockMonthlySpend = 3500;

      spyOn(CreditCardFactory, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
    });

    it('should retrieve KPIs successfully', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(CreditCardFactory.getAllCards).toHaveBeenCalled();
      expect(TransactionFactory.getMonthlySpend).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should calculate total credit limit correctly', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.totalCreditLimit).toBe(33000);
    });

    it('should calculate total outstanding amount correctly', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.outstandingAmount).toBe(8500);
    });

    it('should calculate available credit correctly', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.availableCredit).toBe(24500);
    });

    it('should return monthly spend from TransactionFactory', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.monthlySpend).toBe(3500);
    });

    it('should include lastUpdated timestamp', function() {
      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });

    it('should handle empty card list', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));

      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(0);
    });

    it('should handle cards with null or undefined credit limits', function() {
      var cardsWithNullValues = [
        { cardId: 'card1', creditLimit: null, outstandingAmount: 2000 },
        { cardId: 'card2', creditLimit: undefined, outstandingAmount: 1000 },
        { cardId: 'card3', creditLimit: 10000, outstandingAmount: 3000 }
      ];

      CreditCardFactory.getAllCards.and.returnValue($q.resolve(cardsWithNullValues));

      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.totalCreditLimit).toBe(10000);
    });

    it('should handle cards with null or undefined outstanding amounts', function() {
      var cardsWithNullValues = [
        { cardId: 'card1', creditLimit: 10000, outstandingAmount: null },
        { cardId: 'card2', creditLimit: 15000, outstandingAmount: undefined },
        { cardId: 'card3', creditLimit: 8000, outstandingAmount: 2000 }
      ];

      CreditCardFactory.getAllCards.and.returnValue($q.resolve(cardsWithNullValues));

      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.outstandingAmount).toBe(2000);
      expect(result.availableCredit).toBe(31000);
    });

    it('should reject promise when CreditCardFactory fails', function() {
      CreditCardFactory.getAllCards.and.returnValue($q.reject('Card retrieval error'));

      var error;

      DashboardService.getKPIs().catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Card retrieval error');
    });

    it('should reject promise when TransactionFactory fails', function() {
      TransactionFactory.getMonthlySpend.and.returnValue($q.reject('Transaction error'));

      var error;

      DashboardService.getKPIs().catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Transaction error');
    });

    it('should handle zero monthly spend', function() {
      TransactionFactory.getMonthlySpend.and.returnValue($q.resolve(0));

      var result;

      DashboardService.getKPIs().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.monthlySpend).toBe(0);
    });
  });
});