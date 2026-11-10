/*
Test Documentation:
- Test Name: kpiCalculationFactory - Calculate KPIs
- Purpose: Verify factory calculates all KPIs correctly
- Scenario: Provide cards and transactions
- Expected Result: Returns object with all KPI values
*/
/*
Test Documentation:
- Test Name: kpiCalculationFactory - Total Credit Limit
- Purpose: Verify total credit limit calculation
- Scenario: Multiple cards with different limits
- Expected Result: Sum of all credit limits
*/
/*
Test Documentation:
- Test Name: kpiCalculationFactory - Available Credit
- Purpose: Verify available credit calculation
- Scenario: Cards with balances
- Expected Result: Total limit minus total outstanding
*/
/*
Test Documentation:
- Test Name: kpiCalculationFactory - Monthly Spend
- Purpose: Verify monthly spend calculation
- Scenario: Multiple transactions
- Expected Result: Sum of all transaction amounts
*/
/*
Coverage Report:
- Functions tested: calculate
- Scenarios covered: all KPI calculations, edge cases
- Uncovered scenarios: none
*/

describe('kpiCalculationFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var kpiCalculationFactory;
  
  beforeEach(inject(function(_kpiCalculationFactory_) {
    kpiCalculationFactory = _kpiCalculationFactory_;
  }));
  
  it('should calculate all KPIs correctly', function() {
    var cards = [
      {cardId: 'c1', creditLimit: 10000, currentBalance: 2500},
      {cardId: 'c2', creditLimit: 15000, currentBalance: 5000}
    ];
    var transactions = [
      {transactionId: 't1', amount: 150},
      {transactionId: 't2', amount: 80}
    ];
    
    var result = kpiCalculationFactory.calculate(cards, transactions);
    
    expect(result.monthlySpend).toBe(230);
    expect(result.totalCreditLimit).toBe(25000);
    expect(result.outstandingAmount).toBe(7500);
    expect(result.availableCredit).toBe(17500);
    expect(result.lastUpdated).toBeDefined();
  });
  
  it('should handle empty cards array', function() {
    var cards = [];
    var transactions = [{transactionId: 't1', amount: 100}];
    
    var result = kpiCalculationFactory.calculate(cards, transactions);
    
    expect(result.totalCreditLimit).toBe(0);
    expect(result.outstandingAmount).toBe(0);
    expect(result.availableCredit).toBe(0);
    expect(result.monthlySpend).toBe(100);
  });
  
  it('should handle empty transactions array', function() {
    var cards = [{cardId: 'c1', creditLimit: 10000, currentBalance: 2500}];
    var transactions = [];
    
    var result = kpiCalculationFactory.calculate(cards, transactions);
    
    expect(result.monthlySpend).toBe(0);
    expect(result.totalCreditLimit).toBe(10000);
  });
  
  it('should handle missing values gracefully', function() {
    var cards = [
      {cardId: 'c1', creditLimit: null, currentBalance: undefined},
      {cardId: 'c2', creditLimit: 10000, currentBalance: 2000}
    ];
    var transactions = [
      {transactionId: 't1', amount: null},
      {transactionId: 't2', amount: 100}
    ];
    
    var result = kpiCalculationFactory.calculate(cards, transactions);
    
    expect(result.totalCreditLimit).toBe(10000);
    expect(result.outstandingAmount).toBe(2000);
    expect(result.monthlySpend).toBe(100);
  });
});