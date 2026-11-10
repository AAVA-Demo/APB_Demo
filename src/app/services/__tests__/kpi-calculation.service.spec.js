/*
Test Documentation:
- Test Name: KpiCalculationService Unit Tests
- Purpose: Validate calculateKpis method for computing dashboard KPI metrics
- Scenario: Successful KPI calculation from card data and monthly spend, error handling from dependencies
- Expected Result: Resolved promise with KPIs (monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, lastUpdated), proper error propagation
*/

describe('KpiCalculationService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var KpiCalculationService, CreditCardDataFactory, TransactionFactory, $q, $rootScope;

  beforeEach(inject(function(_KpiCalculationService_, _CreditCardDataFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
    KpiCalculationService = _KpiCalculationService_;
    CreditCardDataFactory = _CreditCardDataFactory_;
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('calculateKpis', function() {

    it('should calculate KPIs successfully', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 },
        { cardId: 2, creditLimit: 10000, balance: 3500 }
      ];
      var mockMonthlySpend = 2500.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(2500.00);
      expect(result.totalCreditLimit).toBe(15000);
      expect(result.outstandingAmount).toBe(4700);
      expect(result.availableCredit).toBe(10300);
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });

    it('should calculate total credit limit correctly', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 3000, balance: 500 },
        { cardId: 2, creditLimit: 7000, balance: 2000 },
        { cardId: 3, creditLimit: 5000, balance: 1500 }
      ];
      var mockMonthlySpend = 1000.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(15000);
    });

    it('should calculate outstanding amount correctly', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 },
        { cardId: 2, creditLimit: 10000, balance: 3500 }
      ];
      var mockMonthlySpend = 2500.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.outstandingAmount).toBe(4700);
    });

    it('should calculate available credit correctly', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 },
        { cardId: 2, creditLimit: 10000, balance: 3500 }
      ];
      var mockMonthlySpend = 2500.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.availableCredit).toBe(10300);
    });

    it('should include monthly spend in KPIs', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 }
      ];
      var mockMonthlySpend = 850.75;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(850.75);
    });

    it('should set lastUpdated timestamp', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 }
      ];
      var mockMonthlySpend = 500.00;
      var beforeTime = new Date();

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      var afterTime = new Date();

      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should handle error from CreditCardDataFactory', function() {
      var mockError = { status: 500, message: 'Server error' };

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.reject(mockError));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(1000));

      var error;
      KpiCalculationService.calculateKpis().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should handle error from TransactionFactory', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 }
      ];
      var mockError = { status: 500, message: 'Transaction service error' };

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.reject(mockError));

      var error;
      KpiCalculationService.calculateKpis().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should handle empty card data', function() {
      var mockCardData = [];
      var mockMonthlySpend = 0;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.monthlySpend).toBe(0);
    });

    it('should handle single card', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 8000, balance: 2500 }
      ];
      var mockMonthlySpend = 1200.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));

      var result;
      KpiCalculationService.calculateKpis().then(function(kpis) {
        result = kpis;
      });

      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(8000);
      expect(result.outstandingAmount).toBe(2500);
      expect(result.availableCredit).toBe(5500);
    });

    it('should call $q.all to retrieve both card data and monthly spend', function() {
      var mockCardData = [
        { cardId: 1, creditLimit: 5000, balance: 1200 }
      ];
      var mockMonthlySpend = 500.00;

      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve(mockCardData));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(mockMonthlySpend));
      spyOn($q, 'all').and.callThrough();

      KpiCalculationService.calculateKpis();
      $rootScope.$digest();

      expect($q.all).toHaveBeenCalled();
    });

    it('should return promise', function() {
      spyOn(CreditCardDataFactory, 'getCardData').and.returnValue($q.resolve([]));
      spyOn(TransactionFactory, 'getMonthlySpend').and.returnValue($q.resolve(0));

      var promise = KpiCalculationService.calculateKpis();

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $rootScope.$digest();
    });

  });

});

/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered:
  * Successful KPI calculation
  * Total credit limit calculation
  * Outstanding amount calculation
  * Available credit calculation
  * Monthly spend inclusion
  * LastUpdated timestamp validation
  * Error from CreditCardDataFactory
  * Error from TransactionFactory
  * Empty card data handling
  * Single card handling
  * $q.all integration validation
  * Promise return validation
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: CreditCardDataFactory, TransactionFactory
*/