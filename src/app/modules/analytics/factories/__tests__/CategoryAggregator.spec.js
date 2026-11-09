/*
Test Documentation:
- Test Name: CategoryAggregator Unit Tests
- Purpose: Validate category-wise transaction aggregation logic
- Scenario: Test aggregateByCategory with various transaction sets
- Expected Result: Factory should correctly aggregate spending by predefined categories
*/

(function(){
'use strict';

describe('CategoryAggregator', function() {
  var CategoryAggregator, CategoryConstants;

  beforeEach(module('spendingAnalyticsModule'));

  beforeEach(inject(function(_CategoryAggregator_, _CategoryConstants_) {
    CategoryAggregator = _CategoryAggregator_;
    CategoryConstants = _CategoryConstants_;
  }));

  describe('aggregateByCategory', function() {
    it('should aggregate transactions by category', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 100},
        {category: 'Food & Dining', amount: 50},
        {category: 'Fuel', amount: 75}
      ];

      var result = CategoryAggregator.aggregateByCategory(transactions);

      var foodCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });

      expect(foodCategory.totalSpend).toBe(150);
      expect(foodCategory.transactionCount).toBe(2);
      expect(fuelCategory.totalSpend).toBe(75);
      expect(fuelCategory.transactionCount).toBe(1);
      expect(result.totalSpend).toBe(225);
    });

    it('should calculate correct percentages', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 100},
        {category: 'Fuel', amount: 100}
      ];

      var result = CategoryAggregator.aggregateByCategory(transactions);

      var foodCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });

      expect(foodCategory.percentage).toBe(50);
      expect(fuelCategory.percentage).toBe(50);
    });

    it('should initialize all predefined categories', function() {
      var transactions = [{category: 'Food & Dining', amount: 100}];

      var result = CategoryAggregator.aggregateByCategory(transactions);

      expect(result.categoryBreakdown.length).toBe(CategoryConstants.length);
      CategoryConstants.forEach(function(cat) {
        var category = result.categoryBreakdown.find(function(c) { return c.category === cat; });
        expect(category).toBeDefined();
      });
    });

    it('should handle empty transaction list', function() {
      var result = CategoryAggregator.aggregateByCategory([]);

      expect(result.totalSpend).toBe(0);
      expect(result.categoryBreakdown.length).toBe(CategoryConstants.length);
      result.categoryBreakdown.forEach(function(cat) {
        expect(cat.totalSpend).toBe(0);
        expect(cat.transactionCount).toBe(0);
        expect(cat.percentage).toBe(0);
      });
    });

    it('should ignore transactions with unknown categories', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 100},
        {category: 'Unknown Category', amount: 50}
      ];

      var result = CategoryAggregator.aggregateByCategory(transactions);

      expect(result.totalSpend).toBe(100);
    });

    it('should set period to Current', function() {
      var result = CategoryAggregator.aggregateByCategory([]);
      expect(result.period).toBe('Current');
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: aggregateByCategory
- Scenarios covered: Multiple transactions, percentage calculation, all categories initialization, empty list, unknown categories
- Edge cases: Zero transactions, unknown categories, equal distribution
- Uncovered scenarios: None - all aggregation logic covered
*/