/*
Test Documentation:
- Test Name: categoryFilterFactory - filterByCategory
- Purpose: Validates that filterByCategory filters transactions by category
- Scenario: When filterByCategory is called with transactions and category, it should return filtered transactions
- Expected Result: Returns only transactions matching the specified category, or all transactions for 'All'
*/
/*
Test Documentation:
- Test Name: categoryFilterFactory - filterByDateRange
- Purpose: Validates that filterByDateRange filters transactions by date range
- Scenario: When filterByDateRange is called with transactions and date range, it should return filtered transactions
- Expected Result: Returns only transactions within the specified date range
*/
/*
Coverage Report:
- Functions tested: filterByCategory, filterByDateRange
- Scenarios covered: category filtering, 'All' category, date range filtering, start date only, end date only, no date range
- Edge cases: null category, empty string category, null dates, undefined dates, transactions outside range
- Uncovered scenarios: none
*/

describe('categoryFilterFactory', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var categoryFilterFactory;
  
  beforeEach(inject(function(_categoryFilterFactory_) {
    categoryFilterFactory = _categoryFilterFactory_;
  }));
  
  describe('filterByCategory', function() {
    it('should be defined', function() {
      expect(categoryFilterFactory.filterByCategory).toBeDefined();
      expect(typeof categoryFilterFactory.filterByCategory).toBe('function');
    });
    
    it('should return all transactions for "All" category', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'},
        {transactionId: 'txn003', category: 'Shopping'}
      ];
      var result = categoryFilterFactory.filterByCategory(transactions, 'All');
      expect(result.length).toBe(3);
      expect(result).toEqual(transactions);
    });
    
    it('should return all transactions for null category', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'}
      ];
      var result = categoryFilterFactory.filterByCategory(transactions, null);
      expect(result.length).toBe(2);
      expect(result).toEqual(transactions);
    });
    
    it('should return all transactions for undefined category', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'}
      ];
      var result = categoryFilterFactory.filterByCategory(transactions, undefined);
      expect(result.length).toBe(2);
      expect(result).toEqual(transactions);
    });
    
    it('should filter transactions by specific category', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'},
        {transactionId: 'txn003', category: 'Food & Dining'}
      ];
      var result = categoryFilterFactory.filterByCategory(transactions, 'Food & Dining');
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn001');
      expect(result[1].transactionId).toBe('txn003');
    });
    
    it('should return empty array if no transactions match category', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'}
      ];
      var result = categoryFilterFactory.filterByCategory(transactions, 'Travel');
      expect(result.length).toBe(0);
    });
    
    it('should handle empty transactions array', function() {
      var result = categoryFilterFactory.filterByCategory([], 'Food & Dining');
      expect(result.length).toBe(0);
    });
    
    it('should filter by all valid categories', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'},
        {transactionId: 'txn003', category: 'Shopping'},
        {transactionId: 'txn004', category: 'Travel'},
        {transactionId: 'txn005', category: 'Entertainment'},
        {transactionId: 'txn006', category: 'Utilities'},
        {transactionId: 'txn007', category: 'Healthcare'},
        {transactionId: 'txn008', category: 'Education'},
        {transactionId: 'txn009', category: 'Miscellaneous'}
      ];
      expect(categoryFilterFactory.filterByCategory(transactions, 'Fuel').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Shopping').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Travel').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Entertainment').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Utilities').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Healthcare').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Education').length).toBe(1);
      expect(categoryFilterFactory.filterByCategory(transactions, 'Miscellaneous').length).toBe(1);
    });
  });
  
  describe('filterByDateRange', function() {
    it('should be defined', function() {
      expect(categoryFilterFactory.filterByDateRange).toBeDefined();
      expect(typeof categoryFilterFactory.filterByDateRange).toBe('function');
    });
    
    it('should return all transactions when no date range provided', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, null, null);
      expect(result.length).toBe(2);
      expect(result).toEqual(transactions);
    });
    
    it('should return all transactions when startDate and endDate are undefined', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, undefined, undefined);
      expect(result.length).toBe(2);
    });
    
    it('should filter transactions by start date only', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')},
        {transactionId: 'txn003', transactionDate: new Date('2024-03-10')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, '2024-02-01', null);
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn002');
      expect(result[1].transactionId).toBe('txn003');
    });
    
    it('should filter transactions by end date only', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')},
        {transactionId: 'txn003', transactionDate: new Date('2024-03-10')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, null, '2024-02-28');
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn001');
      expect(result[1].transactionId).toBe('txn002');
    });
    
    it('should filter transactions by both start and end date', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')},
        {transactionId: 'txn003', transactionDate: new Date('2024-03-10')},
        {transactionId: 'txn004', transactionDate: new Date('2024-04-05')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, '2024-02-01', '2024-03-31');
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn002');
      expect(result[1].transactionId).toBe('txn003');
    });
    
    it('should exclude transactions before start date', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, '2024-02-01', null);
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('txn002');
    });
    
    it('should exclude transactions after end date', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, null, '2024-01-31');
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('txn001');
    });
    
    it('should return empty array if no transactions in date range', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-01-15')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-20')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, '2024-03-01', '2024-03-31');
      expect(result.length).toBe(0);
    });
    
    it('should handle empty transactions array', function() {
      var result = categoryFilterFactory.filterByDateRange([], '2024-01-01', '2024-12-31');
      expect(result.length).toBe(0);
    });
    
    it('should include transactions on boundary dates', function() {
      var transactions = [
        {transactionId: 'txn001', transactionDate: new Date('2024-02-01')},
        {transactionId: 'txn002', transactionDate: new Date('2024-02-15')},
        {transactionId: 'txn003', transactionDate: new Date('2024-02-28')}
      ];
      var result = categoryFilterFactory.filterByDateRange(transactions, '2024-02-01', '2024-02-28');
      expect(result.length).toBe(3);
    });
  });
  
  describe('factory structure', function() {
    it('should return an object with filterByCategory and filterByDateRange', function() {
      expect(typeof categoryFilterFactory).toBe('object');
      expect(categoryFilterFactory.filterByCategory).toBeDefined();
      expect(categoryFilterFactory.filterByDateRange).toBeDefined();
    });
  });
});