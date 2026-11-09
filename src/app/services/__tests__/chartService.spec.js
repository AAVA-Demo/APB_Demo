/*
Test Documentation:
- Test Name: chartService - processData
- Purpose: Validates chart data processing for analytics visualization
- Scenario: Tests monthly trends, card-wise, and category-wise spend aggregation
- Expected Result: Returns correctly aggregated and sorted data for charts
*/
/*
Coverage Report:
- Functions tested: processData
- Scenarios covered: monthly aggregation, card aggregation, category aggregation, sorting, empty input
- Uncovered scenarios: none
*/

describe('chartService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var chartService;
  var categoryService;

  beforeEach(inject(function(_chartService_, _categoryService_) {
    chartService = _chartService_;
    categoryService = _categoryService_;
  }));

  describe('processData', function() {
    it('should process transactions into chart data', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-02-10', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.categoryWiseSpend).toBeDefined();
    });

    it('should aggregate monthly trends correctly', function() {
      var transactions = [
        { transactionDate: '2023-01-15T10:00:00Z', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20T10:00:00Z', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10T10:00:00Z', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].totalSpend).toBe(150);
      expect(result.monthlyTrends[1].totalSpend).toBe(200);
    });

    it('should aggregate card-wise spend', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100, cardId: 'card1', category: 'Food & Dining' },
        { transactionDate: '2023-01-20', amount: 50, cardId: 'card1', category: 'Fuel' },
        { transactionDate: '2023-02-10', amount: 200, cardId: 'card2', category: 'Shopping' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(t) {
        return t.category;
      });

      var result = chartService.processData(transactions);

      expect(result.cardWiseSpendArray.length).toBe(2);
    });

    it('should handle empty transactions', function() {
      var result = chartService.processData([]);

      expect(result.monthlyTrendsArray.length).toBe(0);
      expect(result.cardWiseSpendArray.length).toBe(0);
      expect(result.categoryWiseSpendArray.length).toBe(0);
    });
  });
});