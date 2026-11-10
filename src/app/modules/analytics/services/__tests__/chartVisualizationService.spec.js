/*
Test Documentation:
- Test Name: chartVisualizationService Chart Configuration Generation
- Purpose: Validate Chart.js configuration generation for trend and category charts
- Scenario: Generate line chart config for monthly trends, doughnut chart config for category spending
- Expected Result: Valid Chart.js configurations with correct data, labels, colors, and options
*/

describe('chartVisualizationService', function() {
  beforeEach(module('creditCardApp'));

  var chartVisualizationService;

  beforeEach(inject(function(_chartVisualizationService_) {
    chartVisualizationService = _chartVisualizationService_;
  }));

  describe('generateTrendChartConfig()', function() {
    it('should generate line chart configuration', function() {
      var monthlyTrends = [
        { month: '2026-01', totalSpend: 1500 },
        { month: '2026-02', totalSpend: 1800 },
        { month: '2026-03', totalSpend: 1600 }
      ];

      var config = chartVisualizationService.generateTrendChartConfig(monthlyTrends);

      expect(config.type).toBe('line');
      expect(config.data.labels).toEqual(['2026-01', '2026-02', '2026-03']);
      expect(config.data.datasets[0].data).toEqual([1500, 1800, 1600]);
    });

    it('should set correct chart styling', function() {
      var monthlyTrends = [
        { month: '2026-01', totalSpend: 1000 }
      ];

      var config = chartVisualizationService.generateTrendChartConfig(monthlyTrends);

      expect(config.data.datasets[0].label).toBe('Monthly Spend');
      expect(config.data.datasets[0].borderColor).toBe('#007bff');
      expect(config.data.datasets[0].backgroundColor).toBe('rgba(0,123,255,0.1)');
      expect(config.data.datasets[0].fill).toBe(true);
    });

    it('should configure responsive options', function() {
      var monthlyTrends = [
        { month: '2026-01', totalSpend: 1000 }
      ];

      var config = chartVisualizationService.generateTrendChartConfig(monthlyTrends);

      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
    });

    it('should configure y-axis to start at zero', function() {
      var monthlyTrends = [
        { month: '2026-01', totalSpend: 1000 }
      ];

      var config = chartVisualizationService.generateTrendChartConfig(monthlyTrends);

      expect(config.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });

    it('should handle empty monthly trends', function() {
      var config = chartVisualizationService.generateTrendChartConfig([]);

      expect(config.data.labels).toEqual([]);
      expect(config.data.datasets[0].data).toEqual([]);
    });
  });

  describe('generateCategoryChartConfig()', function() {
    it('should generate doughnut chart configuration', function() {
      var categorySpend = [
        { category: 'Food & Dining', totalAmount: 500 },
        { category: 'Fuel', totalAmount: 300 },
        { category: 'Shopping', totalAmount: 700 }
      ];

      var config = chartVisualizationService.generateCategoryChartConfig(categorySpend);

      expect(config.type).toBe('doughnut');
      expect(config.data.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
      expect(config.data.datasets[0].data).toEqual([500, 300, 700]);
    });

    it('should assign colors to categories', function() {
      var categorySpend = [
        { category: 'Food & Dining', totalAmount: 500 },
        { category: 'Fuel', totalAmount: 300 }
      ];

      var config = chartVisualizationService.generateCategoryChartConfig(categorySpend);

      expect(config.data.datasets[0].backgroundColor.length).toBe(2);
      expect(config.data.datasets[0].backgroundColor[0]).toBe('#FF6384');
      expect(config.data.datasets[0].backgroundColor[1]).toBe('#36A2EB');
    });

    it('should use default color for unknown categories', function() {
      var categorySpend = [
        { category: 'Unknown Category', totalAmount: 100 }
      ];

      var config = chartVisualizationService.generateCategoryChartConfig(categorySpend);

      expect(config.data.datasets[0].backgroundColor[0]).toBe('#999');
    });

    it('should configure responsive options', function() {
      var categorySpend = [
        { category: 'Food & Dining', totalAmount: 500 }
      ];

      var config = chartVisualizationService.generateCategoryChartConfig(categorySpend);

      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
    });

    it('should position legend at bottom', function() {
      var categorySpend = [
        { category: 'Food & Dining', totalAmount: 500 }
      ];

      var config = chartVisualizationService.generateCategoryChartConfig(categorySpend);

      expect(config.options.legend.position).toBe('bottom');
    });

    it('should handle empty category spend', function() {
      var config = chartVisualizationService.generateCategoryChartConfig([]);

      expect(config.data.labels).toEqual([]);
      expect(config.data.datasets[0].data).toEqual([]);
    });
  });
});

/*
Coverage Report:
- Functions tested: generateTrendChartConfig, generateCategoryChartConfig
- Scenarios covered: chart type generation, data mapping, color assignment, responsive options, legend positioning
- Edge cases: empty data arrays, unknown categories, default colors
- Uncovered scenarios: none - all chart configuration patterns tested
*/