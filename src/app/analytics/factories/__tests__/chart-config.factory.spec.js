/*
Test Documentation:
- Test Name: ChartConfigFactory - getTrendChartConfig
- Purpose: Validates generation of line chart configuration for trends
- Scenario: Normal scenario with trend data
- Expected Result: Returns valid Chart.js line chart configuration
*/
/*
Test Documentation:
- Test Name: ChartConfigFactory - getCategoryChartConfig
- Purpose: Validates generation of pie chart configuration for categories
- Scenario: Normal scenario with category data
- Expected Result: Returns valid Chart.js pie chart configuration
*/
/*
Coverage Report:
- Functions tested: getTrendChartConfig, getCategoryChartConfig
- Scenarios covered: trend chart config, category chart config, empty data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('ChartConfigFactory', function() {
    var ChartConfigFactory;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_ChartConfigFactory_) {
      ChartConfigFactory = _ChartConfigFactory_;
    }));

    describe('getTrendChartConfig', function() {
      it('should return line chart configuration', function() {
        var labels = ['2024-01', '2024-02', '2024-03'];
        var data = [1500, 2000, 1800];

        var config = ChartConfigFactory.getTrendChartConfig(labels, data);

        expect(config.type).toBe('line');
        expect(config.data.labels).toEqual(labels);
        expect(config.data.datasets.length).toBe(1);
        expect(config.data.datasets[0].data).toEqual(data);
        expect(config.data.datasets[0].label).toBe('Monthly Spend');
      });

      it('should configure line chart with proper styling', function() {
        var config = ChartConfigFactory.getTrendChartConfig(['2024-01'], [1500]);

        expect(config.data.datasets[0].borderColor).toBe('#36A2EB');
        expect(config.data.datasets[0].backgroundColor).toBe('rgba(54, 162, 235, 0.2)');
        expect(config.data.datasets[0].fill).toBe(true);
        expect(config.data.datasets[0].tension).toBe(0.4);
      });

      it('should configure responsive options', function() {
        var config = ChartConfigFactory.getTrendChartConfig(['2024-01'], [1500]);

        expect(config.options.responsive).toBe(true);
        expect(config.options.maintainAspectRatio).toBe(true);
      });

      it('should configure y-axis with currency formatting', function() {
        var config = ChartConfigFactory.getTrendChartConfig(['2024-01'], [1500]);

        expect(config.options.scales.yAxes).toBeDefined();
        expect(config.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
        expect(config.options.scales.yAxes[0].ticks.callback).toBeDefined();

        var formattedValue = config.options.scales.yAxes[0].ticks.callback(1500);
        expect(formattedValue).toBe('$1,500');
      });

      it('should handle empty data', function() {
        var config = ChartConfigFactory.getTrendChartConfig([], []);

        expect(config.data.labels).toEqual([]);
        expect(config.data.datasets[0].data).toEqual([]);
      });
    });

    describe('getCategoryChartConfig', function() {
      it('should return pie chart configuration', function() {
        var labels = ['Food & Dining', 'Fuel', 'Shopping'];
        var data = [1000, 500, 800];

        var config = ChartConfigFactory.getCategoryChartConfig(labels, data);

        expect(config.type).toBe('pie');
        expect(config.data.labels).toEqual(labels);
        expect(config.data.datasets.length).toBe(1);
        expect(config.data.datasets[0].data).toEqual(data);
      });

      it('should configure pie chart with colors', function() {
        var config = ChartConfigFactory.getCategoryChartConfig(['Food'], [1000]);

        expect(config.data.datasets[0].backgroundColor).toBeDefined();
        expect(Array.isArray(config.data.datasets[0].backgroundColor)).toBe(true);
      });

      it('should configure responsive options', function() {
        var config = ChartConfigFactory.getCategoryChartConfig(['Food'], [1000]);

        expect(config.options.responsive).toBe(true);
        expect(config.options.maintainAspectRatio).toBe(true);
      });

      it('should configure legend position', function() {
        var config = ChartConfigFactory.getCategoryChartConfig(['Food'], [1000]);

        expect(config.options.legend.position).toBe('right');
      });

      it('should handle empty data', function() {
        var config = ChartConfigFactory.getCategoryChartConfig([], []);

        expect(config.data.labels).toEqual([]);
        expect(config.data.datasets[0].data).toEqual([]);
      });

      it('should handle multiple categories', function() {
        var labels = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var data = [100, 200, 300, 400, 500, 600, 700, 800, 900];

        var config = ChartConfigFactory.getCategoryChartConfig(labels, data);

        expect(config.data.labels.length).toBe(9);
        expect(config.data.datasets[0].data.length).toBe(9);
      });
    });
  });
})();