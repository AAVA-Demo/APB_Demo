/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs
- Purpose: Validates that calculateKPIs aggregates card balances and transactions to compute KPIs
- Scenario: User requests KPI calculation for dashboard
- Expected Result: Returns monthlySpend, totalCreditLimit, availableCredit, outstandingAmount, creditUtilization
*/
/*
Test Documentation:
- Test Name: KPICalculationService - calculateKPIs with zero credit limit
- Purpose: Validates that creditUtilization is 0 when totalCreditLimit is 0
- Scenario: User has no credit cards or zero credit limit
- Expected Result: creditUtilization is 0
*/
/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: normal calculation, zero credit limit, multiple cards, multiple transactions
- Uncovered scenarios: none
*/

describe('KPICalculationService', function() {
  'use strict';

  var KPICalculationService, CreditCardDataService, TransactionService, $q, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_KPICalculationService_, _CreditCardDataService_, _TransactionService_, _$q_, _$rootScope_) {
    KPICalculationService = _KPICalculationService_;
    CreditCardDataService = _CreditCardDataService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('calculateKPIs', function() {
    it('should calculate KPIs from card balances and transactions', function() {
      var mockBalances = [
        {cardId: 'card1', creditLimit: 50000, currentBalance: 15000, availableCredit: 35000},
        {cardId: 'card2', creditLimit: 30000, currentBalance: 8000, availableCredit: 22000}
      ];
      var mockTransactions = [
        {transactionId: 't1', amount: 2500},
        {transactionId: 't2', amount: 3000},
        {transactionId: 't3', amount: 1500}
      ];
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      KPICalculationService.calculateKPIs('user123').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(80000);
      expect(result.availableCredit).toBe(57000);
      expect(result.outstandingAmount).toBe(23000);
      expect(result.monthlySpend).toBe(7000);
      expect(result.creditUtilization).toBe('28.75');
      expect(result.timestamp).toBeDefined();
    });

    it('should handle zero credit limit gracefully', function() {
      var mockBalances = [];
      var mockTransactions = [];
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve(mockBalances));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      KPICalculationService.calculateKPIs('user123').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.totalCreditLimit).toBe(0);
      expect(result.creditUtilization).toBe('0');
    });

    it('should call getCardBalances and getMonthlyTransactions with correct userId', function() {
      spyOn(CreditCardDataService, 'getCardBalances').and.returnValue($q.resolve([]));
      spyOn(TransactionService, 'getMonthlyTransactions').and.returnValue($q.resolve([]));

      KPICalculationService.calculateKPIs('user456');
      $rootScope.$digest();

      expect(CreditCardDataService.getCardBalances).toHaveBeenCalledWith('user456');
      expect(TransactionService.getMonthlyTransactions).toHaveBeenCalledWith('user456');
    });
  });
});