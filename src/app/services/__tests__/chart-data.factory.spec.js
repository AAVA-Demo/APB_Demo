/*
Test Documentation:
- Test Name: ChartDataFactory - transformToPieChart
- Purpose: Validates transformation of category spending data to pie chart format
- Scenario: transformToPieChart called with category spending array
- Expected Result: Returns chart data object with labels, datasets, and options

- Test Name: ChartDataFactory - transformToLineChart
- Purpose: Validates transformation of monthly trends data to line chart format
- Scenario: transformToLineChart called with monthly trends array
- Expected Result: Returns chart data object with labels, datasets, and options

- Test Name: ChartDataFactory - transformToBarChart
- Purpose: Validates transformation of card-wise spending data to bar chart format
- Scenario: transformToBarChart called with card-wise spending array
- Expected Result: Returns chart data object with labels, datasets, and options

- Test Name: ChartDataFactory - transformToPieChart with empty array
- Purpose: Validates handling of empty data array
- Scenario: transformToPieChart called with empty array
- Expected Result: Returns chart data with empty labels and data arrays

- Test Name: ChartDataFactory - chart options configuration
- Purpose: Validates chart options are properly configured
- Scenario: Chart transformation methods called
- Expected Result: Returns chart data with responsive options and proper formatting

Coverage Report:
- Functions tested: transformToPieChart, transformToLineChart, transformToBarChart
- Scenarios covered: pie chart transformation, line chart transformation, bar chart transformation, empty data, options configuration
- Edge cases: empty arrays, color mapping
- Uncovered scenarios: none
*/

describe('ChartDataFactory', function() {
  'use strict';

  var ChartDataFactory, CategoryService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_ChartDataFactory_, _CategoryService_) {
    ChartDataFactory = _ChartDataFactory_;
    CategoryService = _CategoryService_;
  }));

  describe('transformToPieChart', function() {
    it('should transform category spending data to pie chart format', function() {
      var categorySpending = [
        {category: 'Food & Dining', amount: 5000, transactionCount: 20},
        {category: 'Shopping', amount: 3000, transactionCount: 15}
      ];

      var chartData = ChartDataFactory.transformToPieChart(categorySpending);

      expect(chartData).toBeDefined();
      expect(chartData.labels).toEqual(['Food & Dining', 'Shopping']);
      expect(chartData.datasets).toBeDefined();
      expect(chartData.datasets[0].data).toEqual([5000, 3000]);
      expect(chartData.datasets[0].backgroundColor).toBeDefined();
      expect(chartData.datasets[0].backgroundColor.length).toBe(2);
      expect(chartData.options).toBeDefined();
      expect(chartData.options.responsive).toBe(true);
      expect(chartData.options.maintainAspectRatio).toBe(false);
    });

    it('should map category colors correctly', function() {
      var categorySpending = [
        {category: 'Food & Dining', amount: 5000, transactionCount: 20}
      ];

      spyOn(CategoryService, 'getCategoryColor').and.returnValue('#FF6384');

      var chartData = ChartDataFactory.transformToPieChart(categorySpending);

      expect(CategoryService.getCategoryColor).toHaveBeenCalledWith('Food & Dining');
      expect(chartData.datasets[0].backgroundColor[0]).toBe('#FF6384');
    });

    it('should handle empty category spending array', function() {
      var categorySpending = [];

      var chartData = ChartDataFactory.transformToPieChart(categorySpending);

      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
      expect(chartData.datasets[0].backgroundColor).toEqual([]);
    });

    it('should include onClick handler in options', function() {
      var categorySpending = [{category: 'Shopping', amount: 3000, transactionCount: 10}];

      var chartData = ChartDataFactory.transformToPieChart(categorySpending);

      expect(chartData.options.onClick).toBeDefined();
      expect(typeof chartData.options.onClick).toBe('function');
    });
  });

  describe('transformToLineChart', function() {
    it('should transform monthly trends data to line chart format', function() {
      var monthlyTrends = [
        {month: 'Jan 2024', amount: 15000},
        {month: 'Feb 2024', amount: 18000}
      ];

      var chartData = ChartDataFactory.transformToLineChart(monthlyTrends);

      expect(chartData).toBeDefined();
      expect(chartData.labels).toEqual(['Jan 2024', 'Feb 2024']);
      expect(chartData.datasets).toBeDefined();
      expect(chartData.datasets[0].data).toEqual([15000, 18000]);
      expect(chartData.datasets[0].borderColor).toBe('#36A2EB');
      expect(chartData.datasets[0].fill).toBe(true);
      expect(chartData.options).toBeDefined();
      expect(chartData.options.responsive).toBe(true);
    });

    it('should handle empty monthly trends array', function() {
      var monthlyTrends = [];

      var chartData = ChartDataFactory.transformToLineChart(monthlyTrends);

      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
    });

    it('should configure y-axis with currency formatting', function() {
      var monthlyTrends = [{month: 'Jan 2024', amount: 15000}];

      var chartData = ChartDataFactory.transformToLineChart(monthlyTrends);

      expect(chartData.options.scales).toBeDefined();
      expect(chartData.options.scales.yAxes).toBeDefined();
      expect(chartData.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
      expect(chartData.options.scales.yAxes[0].ticks.callback).toBeDefined();
    });
  });

  describe('transformToBarChart', function() {
    it('should transform card-wise spending data to bar chart format', function() {
      var cardWiseSpending = [
        {cardId: 'CC001', cardNumber: '**** 1234', amount: 10000},
        {cardId: 'CC002', cardNumber: '**** 5678', amount: 8000}
      ];

      var chartData = ChartDataFactory.transformToBarChart(cardWiseSpending);

      expect(chartData).toBeDefined();
      expect(chartData.labels).toEqual(['**** 1234', '**** 5678']);
      expect(chartData.datasets).toBeDefined();
      expect(chartData.datasets[0].data).toEqual([10000, 8000]);
      expect(chartData.datasets[0].backgroundColor).toBe('#FFCE56');
      expect(chartData.options).toBeDefined();
      expect(chartData.options.responsive).toBe(true);
    });

    it('should handle empty card-wise spending array', function() {
      var cardWiseSpending = [];

      var chartData = ChartDataFactory.transformToBarChart(cardWiseSpending);

      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
    });

    it('should configure y-axis with currency formatting', function() {
      var cardWiseSpending = [{cardId: 'CC001', cardNumber: '**** 1234', amount: 10000}];

      var chartData = ChartDataFactory.transformToBarChart(cardWiseSpending);

      expect(chartData.options.scales).toBeDefined();
      expect(chartData.options.scales.yAxes).toBeDefined();
      expect(chartData.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
      expect(chartData.options.scales.yAxes[0].ticks.callback).toBeDefined();
    });
  });
});