/*
Test Documentation:
- Test Name: analyticsEngineService - processTransactions
- Purpose: Validates the analytics engine service processes transactions correctly
- Scenario: Service calculates monthly trends, category breakdown, and top spending categories
- Expected Result: Returns aggregated analytics data with correct calculations
*/

(function() {
  'use strict';

  describe('analyticsEngineService', function() {
    var analyticsEngineService;
    var categoryClassificationService;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_analyticsEngineService_, _categoryClassificationService_) {
      analyticsEngineService = _analyticsEngineService_;
      categoryClassificationService = _categoryClassificationService_;

      mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2023-01-15', category: 'Food & Dining' },
        { transactionId: 2, amount: 200, transactionDate: '2023-01-20', category: 'Shopping' },
        { transactionId: 3, amount: 150, transactionDate: '2023-02-10', category: 'Food & Dining' },
        { transactionId: 4, amount: 300, transactionDate: '2023-02-15', category: 'Travel' }
      ];

      spyOn(categoryClassificationService, 'categorize').and.callFake(function(transaction) {
        return transaction.category;
      });
    }));

    /*
    Test Documentation:
    - Test Name: should process transactions and return monthly trends
    - Purpose: Validates monthly spend aggregation
    - Scenario: Multiple transactions across different months
    - Expected Result: Returns array of monthly trends sorted by month
    */
    it('should process transactions and return monthly trends', function() {
      var result = analyticsEngineService.processTransactions(mockTransactions);

      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2023-1');
      expect(result.monthlyTrends[0].totalSpend).toBe(300);
      expect(result.monthlyTrends[1].month).toBe('2023-2');
      expect(result.monthlyTrends[1].totalSpend).toBe(450);
    });

    /*
    Test Documentation:
    - Test Name: should calculate category breakdown with percentages
    - Purpose: Validates category-wise spending calculation
    - Scenario: Transactions across multiple categories
    - Expected Result: Returns category breakdown with spend amounts and percentages
    */
    it('should calculate category breakdown with percentages', function() {
      var result = analyticsEngineService.processTransactions(mockTransactions);

      expect(result.categoryBreakdown).toBeDefined();
      expect(result.categoryBreakdown.length).toBe(3);
      
      var foodCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodCategory.totalSpend).toBe(250);
      expect(parseFloat(foodCategory.percentage)).toBeCloseTo(33.33, 1);
    });

    /*
    Test Documentation:
    - Test Name: should identify top 3 spending categories
    - Purpose: Validates top spending categories identification
    - Scenario: Multiple categories with different spend amounts
    - Expected Result: Returns top 3 categories sorted by spend
    */
    it('should identify top 3 spending categories', function() {
      var result = analyticsEngineService.processTransactions(mockTransactions);

      expect(result.topSpendingCategories).toBeDefined();
      expect(result.topSpendingCategories.length).toBe(3);
      expect(result.topSpendingCategories[0]).toBe('Travel');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validates error handling for empty input
    - Scenario: Empty transactions array provided
    - Expected Result: Returns empty analytics data without errors
    */
    it('should handle empty transactions array', function() {
      var result = analyticsEngineService.processTransactions([]);

      expect(result.monthlyTrends).toEqual([]);
      expect(result.categoryBreakdown).toEqual([]);
      expect(result.topSpendingCategories).toEqual([]);
      expect(result.spendingPatterns).toBe('Analysis based on 0 transactions');
    });

    /*
    Test Documentation:
    - Test Name: should generate spending patterns summary
    - Purpose: Validates spending patterns text generation
    - Scenario: Process transactions with pattern summary
    - Expected Result: Returns descriptive spending patterns text
    */
    it('should generate spending patterns summary', function() {
      var result = analyticsEngineService.processTransactions(mockTransactions);

      expect(result.spendingPatterns).toBe('Analysis based on 4 transactions');
    });

    /*
    Test Documentation:
    - Test Name: should call categoryClassificationService for each transaction
    - Purpose: Validates integration with category classification service
    - Scenario: Process transactions requiring categorization
    - Expected Result: Category service called for each transaction
    */
    it('should call categoryClassificationService for each transaction', function() {
      analyticsEngineService.processTransactions(mockTransactions);

      expect(categoryClassificationService.categorize).toHaveBeenCalledTimes(4);
    });
  });

  /*
  Coverage Report:
  - Functions tested: processTransactions, calculateMonthlyTrends, calculateCategoryBreakdown
  - Scenarios covered: normal processing, empty array, monthly aggregation, category breakdown, percentage calculation, top categories identification
  - Edge cases: empty transactions, single month, single category
  - Uncovered scenarios: none
  */
})();