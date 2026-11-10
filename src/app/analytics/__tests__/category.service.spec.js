/*
Test Documentation:
- Test Name: CategoryService Unit Tests
- Purpose: Validate transaction categorization and category breakdown computation
- Scenario: Tests category assignment and spending analysis across all categories
- Expected Result: Service correctly categorizes transactions and computes breakdowns
*/

(function() {
  'use strict';
  
  describe('CategoryService', function() {
    var CategoryService;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_CategoryService_) {
      CategoryService = _CategoryService_;
    }));
    
    describe('categorizeTransactions()', function() {
      it('should return transactions as-is', function() {
        var mockTransactions = [{transactionId: 'txn1', category: 'Food & Dining'}];
        var result = CategoryService.categorizeTransactions(mockTransactions);
        expect(result).toEqual(mockTransactions);
      });
    });
    
    describe('getCategoryBreakdown()', function() {
      it('should compute category totals correctly', function() {
        var transactions = [
          {amount: 1000, category: 'Food & Dining'},
          {amount: 500, category: 'Fuel'},
          {amount: 1500, category: 'Food & Dining'}
        ];
        
        var result = CategoryService.getCategoryBreakdown(transactions);
        var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
        var fuelCategory = result.find(function(c) { return c.category === 'Fuel'; });
        
        expect(foodCategory.amount).toBe(2500);
        expect(fuelCategory.amount).toBe(500);
      });
      
      it('should calculate percentages correctly', function() {
        var transactions = [
          {amount: 1000, category: 'Shopping'},
          {amount: 1000, category: 'Travel'}
        ];
        
        var result = CategoryService.getCategoryBreakdown(transactions);
        var shoppingCategory = result.find(function(c) { return c.category === 'Shopping'; });
        
        expect(shoppingCategory.percentage).toBe('50.00');
      });
      
      it('should include all 9 categories in breakdown', function() {
        var transactions = [{amount: 1000, category: 'Food & Dining'}];
        var result = CategoryService.getCategoryBreakdown(transactions);
        
        expect(result.length).toBe(9);
        var categories = result.map(function(c) { return c.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
      });
      
      it('should assign unknown categories to Miscellaneous', function() {
        var transactions = [
          {amount: 1000, category: 'Unknown Category'}
        ];
        
        var result = CategoryService.getCategoryBreakdown(transactions);
        var miscCategory = result.find(function(c) { return c.category === 'Miscellaneous'; });
        expect(miscCategory.amount).toBe(1000);
      });
      
      it('should handle empty transaction list', function() {
        var result = CategoryService.getCategoryBreakdown([]);
        expect(result.length).toBe(9);
        result.forEach(function(category) {
          expect(category.amount).toBe(0);
          expect(category.percentage).toBe(0);
        });
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: categorizeTransactions, getCategoryBreakdown
- Scenarios covered:
  * Transaction pass-through
  * Category total computation
  * Percentage calculation
  * All 9 categories inclusion
  * Unknown category handling
  * Empty transaction list
- Uncovered scenarios: Invalid amounts, negative values
*/