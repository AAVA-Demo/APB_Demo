/*
Test Documentation:
- Test Name: analyticsService - getSpendingInsights success
- Purpose: Verify that getSpendingInsights successfully retrieves and aggregates spending data
- Scenario: Valid date range is provided and transactions are aggregated by month and category
- Expected Result: Promise resolves with monthly trends and category breakdown
*/
/*
Test Documentation:
- Test Name: analyticsService - aggregateByMonth
- Purpose: Verify that transactions are correctly aggregated by month
- Scenario: Transactions spanning multiple months are provided
- Expected Result: Monthly aggregation with sorted labels and correct totals
*/
/*
Test Documentation:
- Test Name: analyticsService - aggregateByCategory
- Purpose: Verify that transactions are correctly categorized and percentages calculated
- Scenario: Transactions with various categories are provided
- Expected Result: Category breakdown with correct totals and percentages
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights, aggregateByMonth, aggregateByCategory, getDefaultStartDate, getDefaultEndDate
- Scenarios covered: successful aggregation, date defaults, category mapping, percentage calculation, empty data
- Uncovered scenarios: none
*/

describe('analyticsService', function() {
  'use strict';

  var analyticsService;
  var transactionDataFactory;
  var $q;
  var $rootScope;

  beforeEach(module('analyticsModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_analyticsService_, _transactionDataFactory_, _$q_, _$rootScope_) {
    analyticsService = _analyticsService_;
    transactionDataFactory = _transactionDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getSpendingInsights', function() {
    it('should successfully retrieve and aggregate spending insights', function() {
      var dateRange = {
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      };

      var mockTransactions = [
        { transactionDate: '2023-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2023-02-20', amount: 200, category: 'Shopping' },
        { transactionDate: '2023-01-25', amount: 150, category: 'Fuel' }
      ];

      spyOn(transactionDataFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      analyticsService.getSpendingInsights(dateRange).then(function(insights) {
        result = insights;
      });

      $rootScope.$digest();

      expect(result.monthlyTrends).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(transactionDataFactory.getTransactions).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
    });

    it('should use default dates when date range is not provided', function() {
      var mockTransactions = [];

      spyOn(transactionDataFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(analyticsService, 'getDefaultStartDate').and.returnValue('2022-12-01');
      spyOn(analyticsService, 'getDefaultEndDate').and.returnValue('2023-12-01');

      analyticsService.getSpendingInsights({});
      $rootScope.$digest();

      expect(analyticsService.getDefaultStartDate).toHaveBeenCalled();
      expect(analyticsService.getDefaultEndDate).toHaveBeenCalled();
    });
  });

  describe('aggregateByMonth', function() {
    it('should correctly aggregate transactions by month', function() {
      var transactions = [
        { transactionDate: '2023-01-15', amount: 100 },
        { transactionDate: '2023-01-25', amount: 150 },
        { transactionDate: '2023-02-10', amount: 200 },
        { transactionDate: '2023-02-20', amount: 250 }
      ];

      var result = analyticsService.aggregateByMonth(transactions);

      expect(result.labels).toEqual(['2023-01', '2023-02']);
      expect(result.datasets[0].data).toEqual([250, 450]);
      expect(result.datasets[0].label).toBe('Monthly Spend');
    });

    it('should handle empty transaction array', function() {
      var transactions = [];

      var result = analyticsService.aggregateByMonth(transactions);

      expect(result.labels).toEqual([]);
      expect(result.datasets[0].data).toEqual([]);
    });

    it('should sort months chronologically', function() {
      var transactions = [
        { transactionDate: '2023-03-15', amount: 100 },
        { transactionDate: '2023-01-15', amount: 200 },
        { transactionDate: '2023-02-15', amount: 150 }
      ];

      var result = analyticsService.aggregateByMonth(transactions);

      expect(result.labels).toEqual(['2023-01', '2023-02', '2023-03']);
    });
  });

  describe('aggregateByCategory', function() {
    it('should correctly aggregate transactions by category', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining' },
        { amount: 200, category: 'Shopping' },
        { amount: 150, category: 'Food & Dining' },
        { amount: 50, category: 'Fuel' }
      ];

      var result = analyticsService.aggregateByCategory(transactions);

      expect(result.labels).toContain('Food & Dining');
      expect(result.labels).toContain('Shopping');
      expect(result.labels).toContain('Fuel');
      expect(result.datasets[0].data[0]).toBe(250);
    });

    it('should calculate correct percentages for each category', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining' },
        { amount: 100, category: 'Shopping' },
        { amount: 100, category: 'Fuel' },
        { amount: 100, category: 'Travel' }
      ];

      var result = analyticsService.aggregateByCategory(transactions);

      var foodIndex = result.labels.indexOf('Food & Dining');
      expect(result.percentages[foodIndex]).toBe(25);
    });

    it('should map unknown categories to Miscellaneous', function() {
      var transactions = [
        { amount: 100, category: 'Unknown Category' },
        { amount: 200, category: 'Another Unknown' }
      ];

      var result = analyticsService.aggregateByCategory(transactions);

      var miscIndex = result.labels.indexOf('Miscellaneous');
      expect(result.datasets[0].data[miscIndex]).toBe(300);
    });

    it('should handle transactions without category', function() {
      var transactions = [
        { amount: 100 },
        { amount: 200, category: null }
      ];

      var result = analyticsService.aggregateByCategory(transactions);

      var miscIndex = result.labels.indexOf('Miscellaneous');
      expect(result.datasets[0].data[miscIndex]).toBe(300);
    });

    it('should initialize all predefined categories to zero', function() {
      var transactions = [];

      var result = analyticsService.aggregateByCategory(transactions);

      expect(result.labels.length).toBe(9);
      result.datasets[0].data.forEach(function(value) {
        expect(value).toBe(0);
      });
    });

    it('should handle zero total for percentage calculation', function() {
      var transactions = [];

      var result = analyticsService.aggregateByCategory(transactions);

      result.percentages.forEach(function(percentage) {
        expect(percentage).toBe(0);
      });
    });
  });

  describe('getDefaultStartDate', function() {
    it('should return date 12 months ago in ISO format', function() {
      var result = analyticsService.getDefaultStartDate();
      var regex = /^\d{4}-\d{2}-\d{2}$/;

      expect(result).toMatch(regex);

      var resultDate = new Date(result);
      var expectedDate = new Date();
      expectedDate.setMonth(expectedDate.getMonth() - 12);

      expect(resultDate.getFullYear()).toBe(expectedDate.getFullYear());
      expect(resultDate.getMonth()).toBe(expectedDate.getMonth());
    });
  });

  describe('getDefaultEndDate', function() {
    it('should return current date in ISO format', function() {
      var result = analyticsService.getDefaultEndDate();
      var regex = /^\d{4}-\d{2}-\d{2}$/;

      expect(result).toMatch(regex);

      var resultDate = new Date(result);
      var currentDate = new Date();

      expect(resultDate.getFullYear()).toBe(currentDate.getFullYear());
      expect(resultDate.getMonth()).toBe(currentDate.getMonth());
      expect(resultDate.getDate()).toBe(currentDate.getDate());
    });
  });
});