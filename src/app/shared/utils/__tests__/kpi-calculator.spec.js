/*
Test Documentation:
- Test Name: KPICalculator Utility
- Purpose: Validate KPI calculation logic for credit card portfolio
- Scenario: Calculate total credit limit, available credit, outstanding amount, monthly spend
- Expected Result: Accurate KPI calculations from card data
*/

describe('KPICalculator', function() {
  'use strict';
  
  var KPICalculator;
  var mockCards;
  
  beforeEach(function() {
    KPICalculator = window.KPICalculator;
    
    mockCards = [
      {cardId: 'CC001', creditLimit: 100000, availableCredit: 65000, outstandingAmount: 35000, monthlySpend: 28000},
      {cardId: 'CC002', creditLimit: 75000, availableCredit: 50000, outstandingAmount: 25000, monthlySpend: 18000},
      {cardId: 'CC003', creditLimit: 150000, availableCredit: 120000, outstandingAmount: 30000, monthlySpend: 22000}
    ];
  });
  
  describe('Class Definition', function() {
    it('should define KPICalculator class', function() {
      expect(KPICalculator).toBeDefined();
      expect(typeof KPICalculator).toBe('function');
    });
    
    it('should create instance of KPICalculator', function() {
      var calculator = new KPICalculator();
      expect(calculator).toBeDefined();
      expect(calculator instanceof KPICalculator).toBe(true);
    });
    
    it('should have calculateKPIs method', function() {
      var calculator = new KPICalculator();
      expect(calculator.calculateKPIs).toBeDefined();
      expect(typeof calculator.calculateKPIs).toBe('function');
    });
  });
  
  describe('calculateKPIs - Success Scenario', function() {
    it('should calculate total credit limit correctly', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result.totalCreditLimit).toBe(325000);
    });
    
    it('should calculate total available credit correctly', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result.totalAvailableCredit).toBe(235000);
    });
    
    it('should calculate total outstanding amount correctly', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result.totalOutstandingAmount).toBe(90000);
    });
    
    it('should calculate total monthly spend correctly', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result.totalMonthlySpend).toBe(68000);
    });
    
    it('should return cards array in result', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result.cards).toEqual(mockCards);
      expect(result.cards.length).toBe(3);
    });
    
    it('should return result with correct structure', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(mockCards);
      expect(result).toHaveProperty('totalCreditLimit');
      expect(result).toHaveProperty('totalAvailableCredit');
      expect(result).toHaveProperty('totalOutstandingAmount');
      expect(result).toHaveProperty('totalMonthlySpend');
      expect(result).toHaveProperty('cards');
    });
  });
  
  describe('calculateKPIs - Edge Cases', function() {
    it('should handle empty card array', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs([]);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should handle null cards parameter', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(null);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should handle undefined cards parameter', function() {
      var calculator = new KPICalculator();
      var result = calculator.calculateKPIs(undefined);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should handle single card', function() {
      var calculator = new KPICalculator();
      var singleCard = [mockCards[0]];
      var result = calculator.calculateKPIs(singleCard);
      expect(result.totalCreditLimit).toBe(100000);
      expect(result.totalAvailableCredit).toBe(65000);
      expect(result.totalOutstandingAmount).toBe(35000);
      expect(result.totalMonthlySpend).toBe(28000);
    });
    
    it('should handle cards with missing properties', function() {
      var calculator = new KPICalculator();
      var cardsWithMissing = [
        {cardId: 'CC001', creditLimit: 100000},
        {cardId: 'CC002', availableCredit: 50000}
      ];
      var result = calculator.calculateKPIs(cardsWithMissing);
      expect(result.totalCreditLimit).toBe(100000);
      expect(result.totalAvailableCredit).toBe(50000);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
    });
    
    it('should handle cards with zero values', function() {
      var calculator = new KPICalculator();
      var zeroCards = [
        {cardId: 'CC001', creditLimit: 0, availableCredit: 0, outstandingAmount: 0, monthlySpend: 0}
      ];
      var result = calculator.calculateKPIs(zeroCards);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstandingAmount).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
    });
    
    it('should handle cards with negative values', function() {
      var calculator = new KPICalculator();
      var negativeCards = [
        {cardId: 'CC001', creditLimit: 100000, availableCredit: -10000, outstandingAmount: 110000, monthlySpend: 50000}
      ];
      var result = calculator.calculateKPIs(negativeCards);
      expect(result.totalCreditLimit).toBe(100000);
      expect(result.totalAvailableCredit).toBe(-10000);
      expect(result.totalOutstandingAmount).toBe(110000);
    });
  });
  
  describe('Multiple Calculations', function() {
    it('should produce consistent results on multiple calls', function() {
      var calculator = new KPICalculator();
      var result1 = calculator.calculateKPIs(mockCards);
      var result2 = calculator.calculateKPIs(mockCards);
      expect(result1.totalCreditLimit).toBe(result2.totalCreditLimit);
      expect(result1.totalAvailableCredit).toBe(result2.totalAvailableCredit);
    });
    
    it('should handle different card sets independently', function() {
      var calculator = new KPICalculator();
      var cards1 = [mockCards[0]];
      var cards2 = [mockCards[1], mockCards[2]];
      var result1 = calculator.calculateKPIs(cards1);
      var result2 = calculator.calculateKPIs(cards2);
      expect(result1.totalCreditLimit).toBe(100000);
      expect(result2.totalCreditLimit).toBe(225000);
    });
  });
});

/*
Coverage Report:
- Functions tested: calculateKPIs
- Scenarios covered: All KPI calculations, empty array, null/undefined, single card, missing properties, zero values, negative values, multiple calls
- Edge cases: Empty array, null, undefined, single card, missing properties, zero values, negative values
- Uncovered scenarios: None
*/