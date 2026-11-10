/*
Test Documentation:
- Test Name: chartService Unit Tests
- Purpose: Validates chart formatting service for converting analytics data into chart-compatible formats
- Scenario: Tests formatLineChartData and formatPieChartData with various data structures
- Expected Result: Service should correctly format data for Chart.js visualization library
*/

describe('chartService', function() {
  'use strict';

  var chartService;
  var mockMonthlyTrends = [
    {month: 'Jan', totalSpend: 3500},
    {month: 'Feb', totalSpend: 4200},
    {month: 'Mar', totalSpend: 3800}
  ];
  var mockCategoryBreakdown = [
    {category: 'Food & Dining', amount: 2500},
    {category: 'Fuel', amount: 1500},
    {category: 'Shopping', amount: 3000}
  ];

  beforeEach(module('creditCardApp.analytics'));

  beforeEach(inject(function(_chartService_) {
    chartService = _chartService_;
  }));

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(chartService).toBeDefined();
    });

    it('should have formatLineChartData method', function() {
      expect(chartService.formatLineChartData).toBeDefined();
      expect(typeof chartService.formatLineChartData).toBe('function');
    });

    it('should have formatPieChartData method', function() {
      expect(chartService.formatPieChartData).toBeDefined();
      expect(typeof chartService.formatPieChartData).toBe('function');
    });
  });

  describe('formatLineChartData()', function() {
    it('should return object with labels, data, series, and options', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.labels).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.series).toBeDefined();
      expect(result.options).toBeDefined();
    });

    it('should extract month names as labels', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.labels).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('should extract totalSpend values as data', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.data).toEqual([[3500, 4200, 3800]]);
    });

    it('should set series to Monthly Spend', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.series).toEqual(['Monthly Spend']);
    });

    it('should configure responsive options', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.options.responsive).toBe(true);
      expect(result.options.maintainAspectRatio).toBe(false);
    });

    it('should configure y-axis to start at zero', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });

    it('should format y-axis values as currency', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      var callback = result.options.scales.yAxes[0].ticks.callback;
      
      expect(callback(1234.56)).toBe('$1234.56');
    });

    it('should handle empty trends array', function() {
      var result = chartService.formatLineChartData([]);
      
      expect(result.labels).toEqual([]);
      expect(result.data).toEqual([[]]);
    });

    it('should handle single data point', function() {
      var singleTrend = [{month: 'Jan', totalSpend: 3500}];
      var result = chartService.formatLineChartData(singleTrend);
      
      expect(result.labels.length).toBe(1);
      expect(result.data[0].length).toBe(1);
    });
  });

  describe('formatPieChartData()', function() {
    it('should return object with labels, data, and options', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.labels).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.options).toBeDefined();
    });

    it('should extract category names as labels', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
    });

    it('should extract amounts as data', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.data).toEqual([2500, 1500, 3000]);
    });

    it('should configure responsive options', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.options.responsive).toBe(true);
      expect(result.options.maintainAspectRatio).toBe(false);
    });

    it('should configure legend display', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.options.legend.display).toBe(true);
      expect(result.options.legend.position).toBe('right');
    });

    it('should handle empty breakdown array', function() {
      var result = chartService.formatPieChartData([]);
      
      expect(result.labels).toEqual([]);
      expect(result.data).toEqual([]);
    });

    it('should handle single category', function() {
      var singleCategory = [{category: 'Food & Dining', amount: 2500}];
      var result = chartService.formatPieChartData(singleCategory);
      
      expect(result.labels.length).toBe(1);
      expect(result.data.length).toBe(1);
    });
  });

  describe('Data Transformation Accuracy', function() {
    it('should preserve data order in line chart', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(result.labels[0]).toBe('Jan');
      expect(result.data[0][0]).toBe(3500);
      expect(result.labels[1]).toBe('Feb');
      expect(result.data[0][1]).toBe(4200);
    });

    it('should preserve data order in pie chart', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(result.labels[0]).toBe('Food & Dining');
      expect(result.data[0]).toBe(2500);
      expect(result.labels[1]).toBe('Fuel');
      expect(result.data[1]).toBe(1500);
    });

    it('should handle decimal values in line chart', function() {
      var decimalTrends = [{month: 'Jan', totalSpend: 3500.75}];
      var result = chartService.formatLineChartData(decimalTrends);
      
      expect(result.data[0][0]).toBe(3500.75);
    });

    it('should handle decimal values in pie chart', function() {
      var decimalBreakdown = [{category: 'Food', amount: 2500.50}];
      var result = chartService.formatPieChartData(decimalBreakdown);
      
      expect(result.data[0]).toBe(2500.50);
    });
  });

  describe('Chart Configuration Validation', function() {
    it('should provide valid Chart.js line chart configuration', function() {
      var result = chartService.formatLineChartData(mockMonthlyTrends);
      
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(Array.isArray(result.series)).toBe(true);
      expect(typeof result.options).toBe('object');
    });

    it('should provide valid Chart.js pie chart configuration', function() {
      var result = chartService.formatPieChartData(mockCategoryBreakdown);
      
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.options).toBe('object');
    });
  });

  describe('Edge Cases', function() {
    it('should handle trends with zero values', function() {
      var zeroTrends = [{month: 'Jan', totalSpend: 0}];
      var result = chartService.formatLineChartData(zeroTrends);
      
      expect(result.data[0][0]).toBe(0);
    });

    it('should handle breakdown with zero amounts', function() {
      var zeroBreakdown = [{category: 'Food', amount: 0}];
      var result = chartService.formatPieChartData(zeroBreakdown);
      
      expect(result.data[0]).toBe(0);
    });

    it('should handle large numbers in line chart', function() {
      var largeTrends = [{month: 'Jan', totalSpend: 999999.99}];
      var result = chartService.formatLineChartData(largeTrends);
      
      expect(result.data[0][0]).toBe(999999.99);
    });

    it('should handle large numbers in pie chart', function() {
      var largeBreakdown = [{category: 'Food', amount: 999999.99}];
      var result = chartService.formatPieChartData(largeBreakdown);
      
      expect(result.data[0]).toBe(999999.99);
    });
  });
});

/*
Coverage Report:
- Functions tested: formatLineChartData, formatPieChartData
- Scenarios covered:
  * Line chart data formatting with labels, data, series
  * Pie chart data formatting with labels, data
  * Chart.js configuration (responsive, legend, axes)
  * Currency formatting callback
  * Empty data handling
  * Single data point handling
  * Data order preservation
  * Decimal value handling
  * Edge cases (zero values, large numbers)
- Uncovered scenarios: Custom color schemes, animation configuration
*/