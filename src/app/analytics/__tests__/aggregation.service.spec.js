/*
Test Documentation:
- Test Name: AggregationService - aggregateData with transactions
- Purpose: Validates aggregation of transaction data
- Scenario: Service receives categorized transactions
- Expected Result: Returns categorySpends, monthlyTrends, and cardSpends
*/
/*
Test Documentation:
- Test Name: AggregationService - category spending calculation
- Purpose: Validates category-wise spending totals
- Scenario: Multiple transactions in different categories
- Expected Result: Correct totals and percentages per category
*/
/*
Test Documentation:
- Test Name: AggregationService - monthly trends calculation
- Purpose: Validates monthly spending trends
- Scenario: Transactions across multiple months
- Expected Result: Correct monthly totals and sorted by month
*/
/*
Test Documentation:
- Test Name: AggregationService - card-wise spending
- Purpose: Validates card-wise spending breakdown
- Scenario: Transactions across multiple cards
- Expected Result: Correct totals per card with category breakdown
*/
/*
Test Documentation:
- Test Name: AggregationService - percentage calculation
- Purpose: Validates percentage calculation for categories
- Scenario: Multiple categories with different amounts
- Expected Result: Percentages sum to 100%
*/
/*
Test Documentation:
- Test Name: AggregationService - empty transactions
- Purpose: Validates handling of empty transaction array
- Scenario: Empty array passed to aggregateData
- Expected Result: Returns empty arrays for all aggregations
*/
/*
Coverage Report:
- Functions tested: aggregateData()
- Scenarios covered: category aggregation, monthly trends, card spending, percentages, empty data
- Uncovered scenarios: negative amounts, invalid dates
*/

(function() {
  'use strict';

  describe('AggregationService', function() {
    var AggregationService;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_AggregationService_) {
      AggregationService = _AggregationService_;
    }));

    describe('aggregateData()', function() {
      it('should aggregate transactions into category spends', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Card 1' },
          { id: 2, category: 'Food & Dining', amount: 30.00, date: '2024-01-16', cardId: 'card1', cardName: 'Card 1' },
          { id: 3, category: 'Fuel', amount: 45.00, date: '2024-01-17', cardId: 'card2', cardName: 'Card 2' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.categorySpends.length).toBe(2);
        var foodCategory = result.categorySpends.find(function(c) { return c.category === 'Food & Dining'; });
        var fuelCategory = result.categorySpends.find(function(c) { return c.category === 'Fuel'; });

        expect(foodCategory.totalAmount).toBe(80.00);
        expect(foodCategory.transactionCount).toBe(2);
        expect(fuelCategory.totalAmount).toBe(45.00);
        expect(fuelCategory.transactionCount).toBe(1);
      });

      it('should calculate category percentages correctly', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 60.00, date: '2024-01-15', cardId: 'card1', cardName: 'Card 1' },
          { id: 2, category: 'Fuel', amount: 40.00, date: '2024-01-16', cardId: 'card1', cardName: 'Card 1' }
        ];

        var result = AggregationService.aggregateData(transactions);

        var foodCategory = result.categorySpends.find(function(c) { return c.category === 'Food & Dining'; });
        var fuelCategory = result.categorySpends.find(function(c) { return c.category === 'Fuel'; });

        expect(parseFloat(foodCategory.percentage)).toBe(60.00);
        expect(parseFloat(fuelCategory.percentage)).toBe(40.00);
      });

      it('should aggregate transactions into monthly trends', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Card 1' },
          { id: 2, category: 'Fuel', amount: 45.00, date: '2024-01-20', cardId: 'card1', cardName: 'Card 1' },
          { id: 3, category: 'Shopping', amount: 100.00, date: '2024-02-10', cardId: 'card2', cardName: 'Card 2' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.monthlyTrends.length).toBe(2);
        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[0].totalSpend).toBe(95.00);
        expect(result.monthlyTrends[1].month).toBe('2024-02');
        expect(result.monthlyTrends[1].totalSpend).toBe(100.00);
      });

      it('should sort monthly trends chronologically', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-03-15', cardId: 'card1', cardName: 'Card 1' },
          { id: 2, category: 'Fuel', amount: 45.00, date: '2024-01-20', cardId: 'card1', cardName: 'Card 1' },
          { id: 3, category: 'Shopping', amount: 100.00, date: '2024-02-10', cardId: 'card2', cardName: 'Card 2' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.monthlyTrends[0].month).toBe('2024-01');
        expect(result.monthlyTrends[1].month).toBe('2024-02');
        expect(result.monthlyTrends[2].month).toBe('2024-03');
      });

      it('should aggregate transactions by card', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Visa Card' },
          { id: 2, category: 'Fuel', amount: 45.00, date: '2024-01-16', cardId: 'card1', cardName: 'Visa Card' },
          { id: 3, category: 'Shopping', amount: 100.00, date: '2024-01-17', cardId: 'card2', cardName: 'Mastercard' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.cardSpends.length).toBe(2);
        var card1 = result.cardSpends.find(function(c) { return c.cardId === 'card1'; });
        var card2 = result.cardSpends.find(function(c) { return c.cardId === 'card2'; });

        expect(card1.totalSpend).toBe(95.00);
        expect(card1.cardName).toBe('Visa Card');
        expect(card2.totalSpend).toBe(100.00);
        expect(card2.cardName).toBe('Mastercard');
      });

      it('should include category breakdown in card spends', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Visa' },
          { id: 2, category: 'Fuel', amount: 45.00, date: '2024-01-16', cardId: 'card1', cardName: 'Visa' }
        ];

        var result = AggregationService.aggregateData(transactions);

        var card1 = result.cardSpends.find(function(c) { return c.cardId === 'card1'; });
        expect(card1.categoryBreakdown['Food & Dining']).toBe(50.00);
        expect(card1.categoryBreakdown['Fuel']).toBe(45.00);
      });

      it('should handle empty transactions array', function() {
        var result = AggregationService.aggregateData([]);

        expect(result.categorySpends).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.cardSpends).toEqual([]);
      });

      it('should handle transactions without category', function() {
        var transactions = [
          { id: 1, amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Card 1' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.categorySpends.length).toBe(1);
        expect(result.categorySpends[0].category).toBe('Miscellaneous');
        expect(result.categorySpends[0].totalAmount).toBe(50.00);
      });

      it('should include category breakdown in monthly trends', function() {
        var transactions = [
          { id: 1, category: 'Food & Dining', amount: 50.00, date: '2024-01-15', cardId: 'card1', cardName: 'Card 1' },
          { id: 2, category: 'Fuel', amount: 45.00, date: '2024-01-16', cardId: 'card1', cardName: 'Card 1' }
        ];

        var result = AggregationService.aggregateData(transactions);

        expect(result.monthlyTrends[0].categoryBreakdown['Food & Dining']).toBe(50.00);
        expect(result.monthlyTrends[0].categoryBreakdown['Fuel']).toBe(45.00);
      });
    });
  });
})();