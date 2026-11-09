/*
Test Documentation:
- Test Name: AnalyticsEngineAdapter Service Test Suite
- Purpose: Validate the AnalyticsEngineAdapter service processes spending data and formats chart configurations correctly
- Scenario: Tests data processing, chart configuration formatting, edge cases, and error handling
- Expected Result: All methods return expected outputs for valid, invalid, and edge case inputs
*/

(function() {
  'use strict';

  describe('AnalyticsEngineAdapter Service', function() {
    var AnalyticsEngineAdapter;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsEngineAdapter_) {
      AnalyticsEngineAdapter = _AnalyticsEngineAdapter_;
    }));

    describe('processSpendingData', function() {
      it('should process valid spending data correctly', function() {
        var rawData = {
          categories: [
            { categoryName: 'Food & Dining', amount: 500.50 },
            { categoryName: 'Fuel', amount: 200.00 },
            { categoryName: 'Shopping', amount: 350.75 }
          ],
          totalSpend: 1051.25
        };

        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
        expect(result.datasets.length).toBe(1);
        expect(result.datasets[0].data).toEqual([500.50, 200.00, 350.75]);
        expect(result.datasets[0].label).toBe('Spending by Category');
        expect(result.totalSpend).toBe(1051.25);
        expect(result.datasets[0].backgroundColor.length).toBe(3);
      });

      it('should return empty structure when rawData is null', function() {
        var result = AnalyticsEngineAdapter.processSpendingData(null);

        expect(result.labels).toEqual([]);
        expect(result.datasets).toEqual([]);
        expect(result.totalSpend).toBe(0);
      });

      it('should return empty structure when rawData is undefined', function() {
        var result = AnalyticsEngineAdapter.processSpendingData(undefined);

        expect(result.labels).toEqual([]);
        expect(result.datasets).toEqual([]);
        expect(result.totalSpend).toBe(0);
      });

      it('should return empty structure when categories are missing', function() {
        var rawData = { totalSpend: 100 };
        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.labels).toEqual([]);
        expect(result.datasets).toEqual([]);
        expect(result.totalSpend).toBe(0);
      });

      it('should handle empty categories array', function() {
        var rawData = {
          categories: [],
          totalSpend: 0
        };

        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.labels).toEqual([]);
        expect(result.datasets[0].data).toEqual([]);
        expect(result.totalSpend).toBe(0);
      });

      it('should default totalSpend to 0 when not provided', function() {
        var rawData = {
          categories: [
            { categoryName: 'Travel', amount: 100 }
          ]
        };

        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.totalSpend).toBe(0);
      });

      it('should handle single category correctly', function() {
        var rawData = {
          categories: [
            { categoryName: 'Healthcare', amount: 250.00 }
          ],
          totalSpend: 250.00
        };

        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.labels).toEqual(['Healthcare']);
        expect(result.datasets[0].data).toEqual([250.00]);
        expect(result.datasets[0].backgroundColor.length).toBe(1);
      });

      it('should handle multiple categories with zero amounts', function() {
        var rawData = {
          categories: [
            { categoryName: 'Entertainment', amount: 0 },
            { categoryName: 'Education', amount: 0 }
          ],
          totalSpend: 0
        };

        var result = AnalyticsEngineAdapter.processSpendingData(rawData);

        expect(result.labels).toEqual(['Entertainment', 'Education']);
        expect(result.datasets[0].data).toEqual([0, 0]);
        expect(result.totalSpend).toBe(0);
      });
    });

    describe('formatChartConfig', function() {
      it('should format chart config for pie chart correctly', function() {
        var processedData = {
          labels: ['Food', 'Fuel'],
          datasets: [{
            data: [100, 200],
            backgroundColor: ['#FF6384', '#36A2EB'],
            label: 'Spending by Category'
          }],
          totalSpend: 300
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('pie', processedData);

        expect(result.type).toBe('pie');
        expect(result.data.labels).toEqual(['Food', 'Fuel']);
        expect(result.data.datasets).toEqual(processedData.datasets);
        expect(result.options.responsive).toBe(true);
        expect(result.options.maintainAspectRatio).toBe(false);
        expect(result.options.legend.display).toBe(true);
        expect(result.options.legend.position).toBe('bottom');
      });

      it('should format chart config for bar chart correctly', function() {
        var processedData = {
          labels: ['Shopping', 'Travel'],
          datasets: [{
            data: [500, 300],
            backgroundColor: ['#FFCE56', '#4BC0C0'],
            label: 'Spending by Category'
          }],
          totalSpend: 800
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('bar', processedData);

        expect(result.type).toBe('bar');
        expect(result.data.labels).toEqual(['Shopping', 'Travel']);
        expect(result.options.tooltips.enabled).toBe(true);
      });

      it('should format chart config for line chart correctly', function() {
        var processedData = {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{
            data: [100, 200, 150],
            backgroundColor: ['#9966FF', '#FF9F40', '#FF6384'],
            label: 'Spending by Category'
          }],
          totalSpend: 450
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('line', processedData);

        expect(result.type).toBe('line');
        expect(result.data.labels).toEqual(['Jan', 'Feb', 'Mar']);
      });

      it('should include tooltip callback for label formatting', function() {
        var processedData = {
          labels: ['Utilities'],
          datasets: [{
            data: [75.50],
            backgroundColor: ['#C9CBCF'],
            label: 'Spending by Category'
          }],
          totalSpend: 75.50
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('pie', processedData);

        expect(result.options.tooltips.callbacks).toBeDefined();
        expect(typeof result.options.tooltips.callbacks.label).toBe('function');

        var mockTooltipItem = { index: 0 };
        var mockData = {
          labels: ['Utilities'],
          datasets: [{ data: [75.50] }]
        };

        var labelResult = result.options.tooltips.callbacks.label(mockTooltipItem, mockData);
        expect(labelResult).toBe('Utilities: $75.50');
      });

      it('should handle empty labels in tooltip callback', function() {
        var processedData = {
          labels: [''],
          datasets: [{
            data: [100],
            backgroundColor: ['#FF6384'],
            label: 'Spending by Category'
          }],
          totalSpend: 100
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('pie', processedData);

        var mockTooltipItem = { index: 0 };
        var mockData = {
          labels: [''],
          datasets: [{ data: [100] }]
        };

        var labelResult = result.options.tooltips.callbacks.label(mockTooltipItem, mockData);
        expect(labelResult).toBe(': $100.00');
      });

      it('should handle missing label in tooltip callback', function() {
        var processedData = {
          labels: [],
          datasets: [{
            data: [50],
            backgroundColor: ['#36A2EB'],
            label: 'Spending by Category'
          }],
          totalSpend: 50
        };

        var result = AnalyticsEngineAdapter.formatChartConfig('bar', processedData);

        var mockTooltipItem = { index: 0 };
        var mockData = {
          labels: [],
          datasets: [{ data: [50] }]
        };

        var labelResult = result.options.tooltips.callbacks.label(mockTooltipItem, mockData);
        expect(labelResult).toBe(': $50.00');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: processSpendingData, formatChartConfig
  - Scenarios covered:
    * Valid spending data processing
    * Null and undefined input handling
    * Missing categories handling
    * Empty categories array
    * Single and multiple categories
    * Zero amount handling
    * Chart config formatting for pie, bar, and line charts
    * Tooltip callback functionality
    * Edge cases for labels and data
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();