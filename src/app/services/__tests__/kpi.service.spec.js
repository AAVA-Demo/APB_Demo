/*
Test Documentation:
- Test Name: KpiService Unit Tests
- Purpose: Validate KpiService functionality for calculating credit card KPIs including total limits, outstanding amounts, available credit, monthly spend, and utilization rate
- Scenario: Tests cover successful KPI calculation, aggregation logic, utilization rate calculation, edge cases with no cards/transactions, and error handling
- Expected Result: KPIs are accurately calculated with proper aggregation and percentage calculations
*/

(function() {
  'use strict';

  describe('KpiService', function() {
    var KpiService, CardDataService, TransactionService, $q, $rootScope;
    var mockCards, mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KpiService_, _CardDataService_, _TransactionService_, _$q_, _$rootScope_) {
      KpiService = _KpiService_;
      CardDataService = _CardDataService_;
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      mockCards = [
        {
          cardId: 'card1',
          cardNumber: '**** 1234',
          cardType: 'Visa Gold',
          creditLimit: 10000,
          outstandingAmount: 2500,
          availableCredit: 7500
        },
        {
          cardId: 'card2',
          cardNumber: '**** 5678',
          cardType: 'MasterCard',
          creditLimit: 15000,
          outstandingAmount: 5000,
          availableCredit: 10000
        }
      ];

      mockTransactions = [
        { transactionId: 1, amount: 150.50, transactionDate: '2024-01-15' },
        { transactionId: 2, amount: 200.75, transactionDate: '2024-01-20' },
        { transactionId: 3, amount: 99.99, transactionDate: '2024-01-25' }
      ];
    }));

    describe('calculateKPIs', function() {
      it('should calculate all KPIs successfully', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.totalCreditLimit).toBeDefined();
        expect(result.totalAvailableCredit).toBeDefined();
        expect(result.totalOutstanding).toBeDefined();
        expect(result.monthlySpend).toBeDefined();
        expect(result.utilizationRate).toBeDefined();
        expect(result.cards).toBeDefined();
      });

      it('should calculate total credit limit correctly', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.totalCreditLimit).toBe(25000);
      });

      it('should calculate total outstanding amount correctly', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.totalOutstanding).toBe(7500);
      });

      it('should calculate total available credit correctly', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.totalAvailableCredit).toBe(17500);
      });

      it('should calculate monthly spend correctly', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.monthlySpend).toBeCloseTo(451.24, 2);
      });

      it('should calculate utilization rate correctly', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.utilizationRate).toBe('30.00');
      });

      it('should return cards array in result', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.cards).toEqual(mockCards);
        expect(result.cards.length).toBe(2);
      });

      it('should handle empty cards array', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve([]));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.totalOutstanding).toBe(0);
        expect(result.totalAvailableCredit).toBe(0);
        expect(result.utilizationRate).toBe(0);
      });

      it('should handle empty transactions array', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.monthlySpend).toBe(0);
      });

      it('should handle zero credit limit for utilization rate', function() {
        var cardsWithZeroLimit = [
          {
            cardId: 'card1',
            creditLimit: 0,
            outstandingAmount: 0,
            availableCredit: 0
          }
        ];

        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(cardsWithZeroLimit));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.utilizationRate).toBe(0);
      });

      it('should handle CardDataService errors', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.reject('Card API Error'));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var error;
        KpiService.calculateKPIs().catch(function(err) {
          error = err;
        });

        $rootScope.$digest();

        expect(error).toBe('Card API Error');
      });

      it('should handle TransactionService errors', function() {
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.reject('Transaction API Error'));

        var error;
        KpiService.calculateKPIs().catch(function(err) {
          error = err;
        });

        $rootScope.$digest();

        expect(error).toBe('Transaction API Error');
      });

      it('should handle single card correctly', function() {
        var singleCard = [mockCards[0]];
        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(singleCard));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.totalCreditLimit).toBe(10000);
        expect(result.totalOutstanding).toBe(2500);
        expect(result.utilizationRate).toBe('25.00');
      });

      it('should format utilization rate to 2 decimal places', function() {
        var cardsWithOddValues = [
          {
            cardId: 'card1',
            creditLimit: 3000,
            outstandingAmount: 1000,
            availableCredit: 2000
          }
        ];

        spyOn(CardDataService, 'getAllCards').and.returnValue($q.resolve(cardsWithOddValues));
        spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));

        var result;
        KpiService.calculateKPIs().then(function(data) {
          result = data;
        });

        $rootScope.$digest();

        expect(result.utilizationRate).toBe('33.33');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: calculateKPIs
  - Scenarios covered:
    * Successful KPI calculation with all metrics
    * Total credit limit aggregation
    * Total outstanding amount aggregation
    * Total available credit aggregation
    * Monthly spend calculation
    * Utilization rate calculation and formatting
    * Cards array inclusion in result
    * Empty cards array handling
    * Empty transactions array handling
    * Zero credit limit edge case
    * CardDataService error handling
    * TransactionService error handling
    * Single card calculation
    * Utilization rate decimal formatting
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();