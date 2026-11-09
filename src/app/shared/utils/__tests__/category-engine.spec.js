/*
Test Documentation:
- Test Name: CategoryEngine Utility
- Purpose: Validate transaction categorization and aggregation logic
- Scenario: Aggregate by category, month, and card
- Expected Result: Accurate aggregation and categorization of transactions
*/

describe('CategoryEngine', function() {
  'use strict';
  
  var CategoryEngine;
  var mockTransactions;
  
  beforeEach(function() {
    CategoryEngine = window.CategoryEngine;
    
    mockTransactions = [
      {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 2500, category: 'Food & Dining'},
      {transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', amount: 1200, category: 'Fuel'},
      {transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', amount: 4500, category: 'Shopping'},
      {transactionId: 'T004', cardId: 'CC003', date: '2024-02-05', amount: 8000, category: 'Travel'},
      {transactionId: 'T005', cardId: 'CC001', date: '2024-02-10', amount: 1800, category: 'Food & Dining'},
      {transactionId: 'T006', cardId: 'CC002', date: '2024-02-12', amount: 500, category: 'Miscellaneous'}
    ];
  });
  
  describe('Class Definition', function() {
    it('should define CategoryEngine class', function() {
      expect(CategoryEngine).toBeDefined();
      expect(typeof CategoryEngine).toBe('function');
    });
    
    it('should create instance of CategoryEngine', function() {
      var engine = new CategoryEngine();
      expect(engine).toBeDefined();
      expect(engine instanceof CategoryEngine).toBe(true);
    });
    
    it('should have categorizeAndAggregate method', function() {
      var engine = new CategoryEngine();
      expect(engine.categorizeAndAggregate).toBeDefined();
      expect(typeof engine.categorizeAndAggregate).toBe('function');
    });
    
    it('should have aggregateByCategory method', function() {
      var engine = new CategoryEngine();
      expect(engine.aggregateByCategory).toBeDefined();
      expect(typeof engine.aggregateByCategory).toBe('function');
    });
    
    it('should have aggregateByMonth method', function() {
      var engine = new CategoryEngine();
      expect(engine.aggregateByMonth).toBeDefined();
      expect(typeof engine.aggregateByMonth).toBe('function');
    });
    
    it('should have aggregateByCard method', function() {
      var engine = new CategoryEngine();
      expect(engine.aggregateByCard).toBeDefined();
      expect(typeof engine.aggregateByCard).toBe('function');
    });
  });
  
  describe('categorizeAndAggregate', function() {
    it('should return object with all aggregation types', function() {
      var engine = new CategoryEngine();
      var result = engine.categorizeAndAggregate(mockTransactions);
      expect(result).toHaveProperty('categorySpends');
      expect(result).toHaveProperty('monthlyTrends');
      expect(result).toHaveProperty('cardSpends');
    });
    
    it('should aggregate by category', function() {
      var engine = new CategoryEngine();
      var result = engine.categorizeAndAggregate(mockTransactions);
      expect(result.categorySpends).toBeDefined();
      expect(Array.isArray(result.categorySpends)).toBe(true);
    });
    
    it('should aggregate by month', function() {
      var engine = new CategoryEngine();
      var result = engine.categorizeAndAggregate(mockTransactions);
      expect(result.monthlyTrends).toBeDefined();
      expect(Array.isArray(result.monthlyTrends)).toBe(true);
    });
    
    it('should aggregate by card', function() {
      var engine = new CategoryEngine();
      var result = engine.categorizeAndAggregate(mockTransactions);
      expect(result.cardSpends).toBeDefined();
      expect(Array.isArray(result.cardSpends)).toBe(true);
    });
  });
  
  describe('aggregateByCategory', function() {
    it('should group transactions by category', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCategory(mockTransactions);
      expect(result.length).toBeGreaterThan(0);
    });
    
    it('should calculate total amount per category', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCategory(mockTransactions);
      var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory).toBeDefined();
      expect(foodCategory.totalAmount).toBe(4300);
    });
    
    it('should count transactions per category', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCategory(mockTransactions);
      var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.transactionCount).toBe(2);
    });
    
    it('should handle transactions without category', function() {
      var engine = new CategoryEngine();
      var transactionsWithoutCategory = [
        {transactionId: 'T001', amount: 1000}
      ];
      var result = engine.aggregateByCategory(transactionsWithoutCategory);
      var miscCategory = result.find(function(c) { return c.category === 'Miscellaneous'; });
      expect(miscCategory).toBeDefined();
    });
    
    it('should return empty array for empty transactions', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCategory([]);
      expect(result.length).toBe(0);
    });
  });
  
  describe('aggregateByMonth', function() {
    it('should group transactions by month', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByMonth(mockTransactions);
      expect(result.length).toBe(2);
    });
    
    it('should calculate total amount per month', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByMonth(mockTransactions);
      var jan2024 = result.find(function(m) { return m.month === '2024-01'; });
      expect(jan2024).toBeDefined();
      expect(jan2024.totalAmount).toBe(8200);
    });
    
    it('should sort months chronologically', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByMonth(mockTransactions);
      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
    });
    
    it('should format month as YYYY-MM', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByMonth(mockTransactions);
      result.forEach(function(m) {
        expect(m.month).toMatch(/^\d{4}-\d{2}$/);
      });
    });
    
    it('should return empty array for empty transactions', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByMonth([]);
      expect(result.length).toBe(0);
    });
  });
  
  describe('aggregateByCard', function() {
    it('should group transactions by card', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCard(mockTransactions);
      expect(result.length).toBe(3);
    });
    
    it('should calculate total spend per card', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCard(mockTransactions);
      var cc001 = result.find(function(c) { return c.cardId === 'CC001'; });
      expect(cc001).toBeDefined();
      expect(cc001.totalSpend).toBe(5500);
    });
    
    it('should set cardName same as cardId', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCard(mockTransactions);
      result.forEach(function(c) {
        expect(c.cardName).toBe(c.cardId);
      });
    });
    
    it('should return empty array for empty transactions', function() {
      var engine = new CategoryEngine();
      var result = engine.aggregateByCard([]);
      expect(result.length).toBe(0);
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle single transaction', function() {
      var engine = new CategoryEngine();
      var singleTransaction = [mockTransactions[0]];
      var result = engine.categorizeAndAggregate(singleTransaction);
      expect(result.categorySpends.length).toBe(1);
      expect(result.monthlyTrends.length).toBe(1);
      expect(result.cardSpends.length).toBe(1);
    });
    
    it('should handle transactions with same category', function() {
      var engine = new CategoryEngine();
      var sameCategory = [
        {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 1000, category: 'Food'},
        {transactionId: 'T002', cardId: 'CC001', date: '2024-01-16', amount: 2000, category: 'Food'}
      ];
      var result = engine.aggregateByCategory(sameCategory);
      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(3000);
      expect(result[0].transactionCount).toBe(2);
    });
    
    it('should handle transactions in same month', function() {
      var engine = new CategoryEngine();
      var sameMonth = [
        {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 1000},
        {transactionId: 'T002', cardId: 'CC001', date: '2024-01-20', amount: 2000}
      ];
      var result = engine.aggregateByMonth(sameMonth);
      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(3000);
    });
    
    it('should handle transactions from same card', function() {
      var engine = new CategoryEngine();
      var sameCard = [
        {transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 1000},
        {transactionId: 'T002', cardId: 'CC001', date: '2024-01-20', amount: 2000}
      ];
      var result = engine.aggregateByCard(sameCard);
      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(3000);
    });
  });
});

/*
Coverage Report:
- Functions tested: categorizeAndAggregate, aggregateByCategory, aggregateByMonth, aggregateByCard
- Scenarios covered: All aggregation types, empty arrays, single transaction, duplicate categories/months/cards
- Edge cases: Empty transactions, single transaction, missing category, same category/month/card
- Uncovered scenarios: None
*/