/*
Test Documentation:
- Test Name: ChartConfigFactory functionality
- Purpose: Validate chart configuration generation
- Scenario: Test generateChartConfig for different chart types
- Expected Result: Correct chart configurations generated
*/

(function() {
  'use strict';

  describe('ChartConfigFactory', function() {
    var ChartConfigFactory;
    var mockLineData = [
      { month: 'Jan 2023', amount: 1500 },
      { month: 'Feb 2023', amount: 2000 },
      { month: 'Mar 2023', amount: 1800 }
    ];
    var mockBarData = [
      { cardName: 'Visa Gold', amount: 3000 },
      { cardName: 'Mastercard Platinum', amount: 4500 }
    ];
    var mockPieData = [
      { category: 'Food & Dining', amount: 1200 },
      { category: 'Shopping', amount: 800 },
      { category: 'Travel', amount: 600 }
    ];

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_ChartConfigFactory_) {
      ChartConfigFactory = _ChartConfigFactory_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure factory is injectable
    - Scenario: Inject ChartConfigFactory
    - Expected Result: Factory is defined
    */
    it('should be defined', function() {
      expect(ChartConfigFactory).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: generateChartConfig should create line chart config
    - Purpose: Validate line chart configuration
    - Scenario: Generate config for monthly trends
    - Expected Result: Correct line chart config with labels and data
    */
    it('generateChartConfig should create line chart config', function() {
      var config = ChartConfigFactory.generateChartConfig(mockLineData, 'line');

      expect(config.type).toBe('line');
      expect(config.data.labels).toEqual(['Jan 2023', 'Feb 2023', 'Mar 2023']);
      expect(config.data.datasets[0].data).toEqual([1500, 2000, 1800]);
      expect(config.data.datasets[0].label).toBe('Monthly Spend');
      expect(config.options.responsive).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: generateChartConfig should create bar chart config
    - Purpose: Validate bar chart configuration
    - Scenario: Generate config for card-wise spending
    - Expected Result: Correct bar chart config with labels and data
    */
    it('generateChartConfig should create bar chart config', function() {
      var config = ChartConfigFactory.generateChartConfig(mockBarData, 'bar');

      expect(config.type).toBe('bar');
      expect(config.data.labels).toEqual(['Visa Gold', 'Mastercard Platinum']);
      expect(config.data.datasets[0].data).toEqual([3000, 4500]);
      expect(config.data.datasets[0].backgroundColor).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: generateChartConfig should create pie chart config
    - Purpose: Validate pie chart configuration
    - Scenario: Generate config for category-wise spending
    - Expected Result: Correct pie chart config with labels and data
    */
    it('generateChartConfig should create pie chart config', function() {
      var config = ChartConfigFactory.generateChartConfig(mockPieData, 'pie');

      expect(config.type).toBe('pie');
      expect(config.data.labels).toEqual(['Food & Dining', 'Shopping', 'Travel']);
      expect(config.data.datasets[0].data).toEqual([1200, 800, 600]);
      expect(config.data.datasets[0].backgroundColor).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: generateChartConfig should create doughnut chart config
    - Purpose: Validate doughnut chart configuration
    - Scenario: Generate config for category distribution
    - Expected Result: Correct doughnut chart config
    */
    it('generateChartConfig should create doughnut chart config', function() {
      var config = ChartConfigFactory.generateChartConfig(mockPieData, 'doughnut');

      expect(config.type).toBe('doughnut');
      expect(config.data.labels).toEqual(['Food & Dining', 'Shopping', 'Travel']);
      expect(config.data.datasets[0].data).toEqual([1200, 800, 600]);
    });

    /*
    Test Documentation:
    - Test Name: generateChartConfig should include responsive options
    - Purpose: Validate responsive configuration
    - Scenario: Check options object
    - Expected Result: Responsive and maintainAspectRatio set correctly
    */
    it('generateChartConfig should include responsive options', function() {
      var config = ChartConfigFactory.generateChartConfig(mockLineData, 'line');

      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
      expect(config.options.legend.display).toBe(true);
      expect(config.options.tooltips.enabled).toBe(true);
    });
  });

  /*
  Coverage Report:
  - Functions tested: generateChartConfig
  - Scenarios covered: line chart, bar chart, pie chart, doughnut chart, responsive options
  - Uncovered scenarios: none
  */
})();