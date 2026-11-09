/*
Test Documentation:
- Test Name: chartService - data processing for charts
- Purpose: Validates chart service processes transaction data for visualizations
- Scenario: Service calculates monthly trends, card-wise, and category-wise spending
- Expected Result: Returns formatted data for chart rendering
*/

(function() {
  'use strict';

  describe('chartService', function() {
    var chartService;
    var categoryService;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_chartService_, _categoryService_) {
      chartService = _chartService_;
      categoryService = _categoryService_;

      mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2023-01-15', cardId: 'card1', category: 'Food & Dining' },
        { transactionId: 2, amount: 200, transactionDate: '2023-01-20', cardId: 'card2', category: 'Shopping' },
        { transactionId: 3, amount: 150, transactionDate: '2023-02-10', cardId: 'card1', category: 'Food & Dining' },
        { transactionId: 4, amount: 300, transactionDate: '2023-02-15', cardId: 'card2', category: 'Travel' }
      ];

      spyOn(categoryService, 'categorize').and.callFake(function(transaction) {
        return transaction.category;
      });
    }));

    /*
    Test Documentation:
    - Test Name: should process data and return all chart types
    - Purpose: Validates processData returns complete data structure
    - Scenario: Process transactions for all chart types
    - Expected Result: Returns object with monthlyTrends, cardWiseSpend, categoryWiseSpend
    */
    it('should process data and return all chart types', function() {
      var result = chartService.processData(mockTransactions);

      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.categoryWiseSpend).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should calculate monthly trends correctly
    - Purpose: Validates monthly spend aggregation
    - Scenario: Transactions across multiple months
    - Expected Result: Returns monthly trends sorted by month
    */
    it('should calculate monthly trends correctly', function() {
      var result = chartService.processData(mockTransactions);

      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2023-1');
      expect(result.monthlyTrends[0].totalSpend).toBe(300);
      expect(result.monthlyTrends[1].month).toBe('2023-2');
      expect(result.monthlyTrends[1].totalSpend).toBe(450);
    });

    /*
    Test Documentation:
    - Test Name: should calculate card-wise spending
    - Purpose: Validates spending aggregation by card
    - Scenario: Transactions from multiple cards
    - Expected Result: Returns spending totals for each card
    */
    it('should calculate card-wise spending', function() {
      var result = chartService.processData(mockTransactions);

      expect(result.cardWiseSpend.length).toBe(2);
      
      var card1Spend = result.cardWiseSpend.find(function(c) { return c.cardId === 'card1'; });
      var card2Spend = result.cardWiseSpend.find(function(c) { return c.cardId === 'card2'; });
      
      expect(card1Spend.totalSpend).toBe(250);
      expect(card2Spend.totalSpend).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should calculate category-wise spending
    - Purpose: Validates spending aggregation by category
    - Scenario: Transactions across multiple categories
    - Expected Result: Returns spending totals for each category
    */
    it('should calculate category-wise spending', function() {
      var result = chartService.processData(mockTransactions);

      expect(result.categoryWiseSpend.length).toBe(3);
      
      var foodSpend = result.categoryWiseSpend.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodSpend.totalSpend).toBe(250);
    });

    /*
    Test Documentation:
    - Test Name: should sort monthly trends chronologically
    - Purpose: Validates monthly trends are sorted by date
    - Scenario: Process transactions in random date order
    - Expected Result: Returns trends sorted from earliest to latest month
    */
    it('should sort monthly trends chronologically', function() {
      var unsortedTransactions = [
        { amount: 100, transactionDate: '2023-03-15', cardId: 'card1', category: 'Food & Dining' },
        { amount: 200, transactionDate: '2023-01-20', cardId: 'card1', category: 'Shopping' },
        { amount: 150, transactionDate: '2023-02-10', cardId: 'card1', category: 'Travel' }
      ];

      var result = chartService.processData(unsortedTransactions);

      expect(result.monthlyTrends[0].month).toBe('2023-1');
      expect(result.monthlyTrends[1].month).toBe('2023-2');
      expect(result.monthlyTrends[2].month).toBe('2023-3');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validates error handling for empty input
    - Scenario: Empty transactions array provided
    - Expected Result: Returns empty arrays for all chart types
    */
    it('should handle empty transactions array', function() {
      var result = chartService.processData([]);

      expect(result.monthlyTrends).toEqual([]);
      expect(result.cardWiseSpend).toEqual([]);
      expect(result.categoryWiseSpend).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should aggregate same month transactions
    - Purpose: Validates multiple transactions in same month are summed
    - Scenario: Multiple transactions in same month
    - Expected Result: Single monthly trend entry with summed amount
    */
    it('should aggregate same month transactions', function() {
      var sameMonthTransactions = [
        { amount: 100, transactionDate: '2023-01-05', cardId: 'card1', category: 'Food & Dining' },
        { amount: 200, transactionDate: '2023-01-15', cardId: 'card1', category: 'Shopping' },
        { amount: 150, transactionDate: '2023-01-25', cardId: 'card1', category: 'Travel' }
      ];

      var result = chartService.processData(sameMonthTransactions);

      expect(result.monthlyTrends.length).toBe(1);
      expect(result.monthlyTrends[0].totalSpend).toBe(450);
    });

    /*
    Test Documentation:
    - Test Name: should call categoryService for categorization
    - Purpose: Validates integration with category service
    - Scenario: Process transactions requiring categorization
    - Expected Result: Category service called for each transaction
    */
    it('should call categoryService for categorization', function() {
      chartService.processData(mockTransactions);

      expect(categoryService.categorize).toHaveBeenCalledTimes(4);
    });
  });

  /*
  Coverage Report:
  - Functions tested: processData, calculateMonthlyTrends, calculateCardWiseSpend, calculateCategoryWiseSpend
  - Scenarios covered: all chart types, monthly aggregation, card aggregation, category aggregation, sorting, empty array
  - Edge cases: empty transactions, same month aggregation, unsorted dates
  - Uncovered scenarios: none
  */
})();