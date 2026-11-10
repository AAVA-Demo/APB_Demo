/*
Test Documentation:
- Test Name: CategoryAggregationService - aggregateByCategory
- Purpose: Validates aggregation of transactions by category and month
- Scenario: Normal scenario with multiple transactions across categories
- Expected Result: Returns monthly trends, category breakdown, and card-wise spend
*/
/*
Test Documentation:
- Test Name: CategoryAggregationService - empty transactions
- Purpose: Validates handling of empty transaction list
- Scenario: Edge case with no transactions
- Expected Result: Returns empty aggregations with zero values
*/
/*
Test Documentation:
- Test Name: CategoryAggregationService - miscellaneous category
- Purpose: Validates unknown categories are mapped to Miscellaneous
- Scenario: Edge case with unknown category
- Expected Result: Unknown categories counted in Miscellaneous
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory
- Scenarios covered: normal aggregation, empty transactions, unknown categories, multiple months, multiple cards
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryAggregationService', function() {
    var CategoryAggregationService;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_CategoryAggregationService_) {
      CategoryAggregationService = _CategoryAggregationService_;
    }));

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category and month', function() {
        var transactions = [
          { date: '2024-01-15', amount: 100, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-20', amount: 50, category: 'Fuel', cardId: 'card-1' },
          { date: '2024-02-10', amount: 200, category: 'Shopping', cardId: 'card-2' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        expect(result.monthlyTrends).toEqual([
          { month: '2024-01', totalSpend: 150 },
          { month: '2024-02', totalSpend: 200 }
        ]);

        expect(result.categoryBreakdown.length).toBe(9);
        var foodCategory = result.categoryBreakdown.find(function(cat) { return cat.category === 'Food & Dining'; });
        expect(foodCategory.totalSpend).toBe(100);
        expect(foodCategory.percentage).toBe('28.57');

        expect(result.cardWiseSpend).toEqual([
          { cardId: 'card-1', totalSpend: 150 },
          { cardId: 'card-2', totalSpend: 200 }
        ]);
      });

      it('should handle empty transaction list', function() {
        var result = CategoryAggregationService.aggregateByCategory([]);

        expect(result.monthlyTrends).toEqual([]);
        expect(result.categoryBreakdown.length).toBe(9);
        result.categoryBreakdown.forEach(function(cat) {
          expect(cat.totalSpend).toBe(0);
          expect(cat.percentage).toBe(0);
        });
        expect(result.cardWiseSpend).toEqual([]);
      });

      it('should map unknown categories to Miscellaneous', function() {
        var transactions = [
          { date: '2024-01-15', amount: 100, category: 'Unknown Category', cardId: 'card-1' },
          { date: '2024-01-20', amount: 50, category: 'Another Unknown', cardId: 'card-1' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        var miscCategory = result.categoryBreakdown.find(function(cat) { return cat.category === 'Miscellaneous'; });
        expect(miscCategory.totalSpend).toBe(150);
      });

      it('should aggregate all predefined categories', function() {
        var transactions = [
          { date: '2024-01-01', amount: 10, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-02', amount: 20, category: 'Fuel', cardId: 'card-1' },
          { date: '2024-01-03', amount: 30, category: 'Shopping', cardId: 'card-1' },
          { date: '2024-01-04', amount: 40, category: 'Travel', cardId: 'card-1' },
          { date: '2024-01-05', amount: 50, category: 'Entertainment', cardId: 'card-1' },
          { date: '2024-01-06', amount: 60, category: 'Utilities', cardId: 'card-1' },
          { date: '2024-01-07', amount: 70, category: 'Healthcare', cardId: 'card-1' },
          { date: '2024-01-08', amount: 80, category: 'Education', cardId: 'card-1' },
          { date: '2024-01-09', amount: 90, category: 'Miscellaneous', cardId: 'card-1' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        expect(result.categoryBreakdown.length).toBe(9);
        var totalSpend = result.categoryBreakdown.reduce(function(sum, cat) { return sum + cat.totalSpend; }, 0);
        expect(totalSpend).toBe(450);
      });

      it('should sort monthly trends chronologically', function() {
        var transactions = [
          { date: '2024-03-15', amount: 100, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-20', amount: 50, category: 'Fuel', cardId: 'card-1' },
          { date: '2024-02-10', amount: 200, category: 'Shopping', cardId: 'card-1' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[1].month).toBe('2024-02');
        expect(result.monthlyTrends[2].month).toBe('2024-03');
      });

      it('should calculate percentages correctly', function() {
        var transactions = [
          { date: '2024-01-15', amount: 250, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-20', amount: 250, category: 'Fuel', cardId: 'card-1' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        var foodCategory = result.categoryBreakdown.find(function(cat) { return cat.category === 'Food & Dining'; });
        var fuelCategory = result.categoryBreakdown.find(function(cat) { return cat.category === 'Fuel'; });
        
        expect(foodCategory.percentage).toBe('50.00');
        expect(fuelCategory.percentage).toBe('50.00');
      });

      it('should aggregate card-wise spending correctly', function() {
        var transactions = [
          { date: '2024-01-15', amount: 100, category: 'Food & Dining', cardId: 'card-1' },
          { date: '2024-01-20', amount: 50, category: 'Fuel', cardId: 'card-1' },
          { date: '2024-01-25', amount: 200, category: 'Shopping', cardId: 'card-2' },
          { date: '2024-01-30', amount: 75, category: 'Travel', cardId: 'card-2' }
        ];

        var result = CategoryAggregationService.aggregateByCategory(transactions);

        expect(result.cardWiseSpend.length).toBe(2);
        var card1Spend = result.cardWiseSpend.find(function(card) { return card.cardId === 'card-1'; });
        var card2Spend = result.cardWiseSpend.find(function(card) { return card.cardId === 'card-2'; });
        
        expect(card1Spend.totalSpend).toBe(150);
        expect(card2Spend.totalSpend).toBe(275);
      });
    });
  });
})();