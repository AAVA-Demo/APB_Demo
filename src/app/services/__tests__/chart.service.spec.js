/*
Test Documentation:
- Test Name: ChartService - prepareCategoryChart creates chart configuration
- Purpose: Validates category chart data preparation
- Scenario: Given category spending data
- Expected Result: Returns chart.js compatible configuration with labels, data, and colors
*/
/*
Test Documentation:
- Test Name: ChartService - prepareTrendChart creates trend chart configuration
- Purpose: Validates monthly trend chart data preparation
- Scenario: Given monthly trend data
- Expected Result: Returns line chart configuration with datasets and options
*/
/*
Coverage Report:
- Functions tested: prepareCategoryChart, prepareTrendChart
- Scenarios covered: valid data, empty data, chart configuration structure
- Uncovered scenarios: none
*/

describe('ChartService', function() {
  'use strict';

  beforeEach(module('creditCardApp.analytics'));

  var ChartService;

  beforeEach(inject(function(_ChartService_) {
    ChartService = _ChartService_;
  }));

  describe('prepareCategoryChart', function() {
    it('should prepare chart data with labels and values', function() {
      var categorySpend = [
        {category: 'Food & Dining', totalSpend: 150},
        {category: 'Fuel', totalSpend: 120},
        {category: 'Shopping', totalSpend: 300}
      ];

      var result = ChartService.prepareCategoryChart(categorySpend);

      expect(result.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
      expect(result.data).toEqual([150, 120, 300]);
      expect(result.colors).toBeDefined();
      expect(result.colors.length).toBeGreaterThan(0);
    });

    it('should include chart options', function() {
      var categorySpend = [{category: 'Food & Dining', totalSpend: 150}];
      var result = ChartService.prepareCategoryChart(categorySpend);

      expect(result.options).toBeDefined();
      expect(result.options.responsive).toBe(true);
      expect(result.options.maintainAspectRatio).toBe(true);
      expect(result.options.legend).toBeDefined();
    });

    it('should handle empty category spend array', function() {
      var result = ChartService.prepareCategoryChart([]);
      expect(result.labels).toEqual([]);
      expect(result.data).toEqual([]);
    });
  });

  describe('prepareTrendChart', function() {
    it('should prepare trend chart data with monthly labels', function() {
      var monthlyTrends = [
        {month: '2024-01', totalSpend: 500},
        {month: '2024-02', totalSpend: 600},
        {month: '2024-03', totalSpend: 550}
      ];

      var result = ChartService.prepareTrendChart(monthlyTrends);

      expect(result.labels).toEqual(['2024-01', '2024-02', '2024-03']);
      expect(result.datasets).toBeDefined();
      expect(result.datasets.length).toBe(1);
      expect(result.datasets[0].data).toEqual([500, 600, 550]);
    });

    it('should include dataset styling', function() {
      var monthlyTrends = [{month: '2024-01', totalSpend: 500}];
      var result = ChartService.prepareTrendChart(monthlyTrends);

      expect(result.datasets[0].label).toBe('Monthly Spend');
      expect(result.datasets[0].borderColor).toBe('#36A2EB');
      expect(result.datasets[0].backgroundColor).toBeDefined();
      expect(result.datasets[0].fill).toBe(true);
    });

    it('should include chart options with scales', function() {
      var monthlyTrends = [{month: '2024-01', totalSpend: 500}];
      var result = ChartService.prepareTrendChart(monthlyTrends);

      expect(result.options).toBeDefined();
      expect(result.options.responsive).toBe(true);
      expect(result.options.scales).toBeDefined();
      expect(result.options.scales.yAxes).toBeDefined();
      expect(result.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });

    it('should handle empty monthly trends array', function() {
      var result = ChartService.prepareTrendChart([]);
      expect(result.labels).toEqual([]);
      expect(result.datasets[0].data).toEqual([]);
    });
  });
});