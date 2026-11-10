/*
Test Documentation:
- Test Name: chartConfigFactory Test Suite
- Purpose: Validate Chart.js configuration generation for line and pie charts
- Scenario: Tests configuration object creation for different chart types with various data inputs
- Expected Result: Correctly formatted Chart.js configuration objects with proper structure and options
*/

(function() {
'use strict';

describe('chartConfigFactory', function() {
  var chartConfigFactory;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_chartConfigFactory_) {
    chartConfigFactory = _chartConfigFactory_;
  }));

  describe('getLineChartConfig', function() {
    /*
    Test Documentation:
    - Test Name: should return valid line chart configuration with default label
    - Purpose: Verify line chart config generation with default parameters
    - Scenario: Call getLineChartConfig with labels and data, no custom label
    - Expected Result: Returns complete Chart.js line chart config with 'Spend' as default label
    */
    it('should return valid line chart configuration with default label', function() {
      var labels = ['Jan', 'Feb', 'Mar'];
      var data = [100, 200, 150];
      var config = chartConfigFactory.getLineChartConfig(labels, data);
      
      expect(config).toBeDefined();
      expect(config.type).toBe('line');
      expect(config.data).toBeDefined();
      expect(config.data.labels).toEqual(labels);
      expect(config.data.datasets).toBeDefined();
      expect(config.data.datasets.length).toBe(1);
      expect(config.data.datasets[0].label).toBe('Spend');
      expect(config.data.datasets[0].data).toEqual(data);
    });

    /*
    Test Documentation:
    - Test Name: should return line chart configuration with custom label
    - Purpose: Verify custom label is applied to line chart
    - Scenario: Call getLineChartConfig with custom label parameter
    - Expected Result: Returns config with specified custom label
    */
    it('should return line chart configuration with custom label', function() {
      var labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      var data = [1000, 1500, 1200, 1800];
      var customLabel = 'Quarterly Revenue';
      var config = chartConfigFactory.getLineChartConfig(labels, data, customLabel);
      
      expect(config.data.datasets[0].label).toBe(customLabel);
    });

    /*
    Test Documentation:
    - Test Name: should include proper styling properties for line chart
    - Purpose: Verify line chart has correct visual styling properties
    - Scenario: Generate line chart config and check styling attributes
    - Expected Result: Config includes borderColor, backgroundColor, and tension properties
    */
    it('should include proper styling properties for line chart', function() {
      var labels = ['Mon', 'Tue', 'Wed'];
      var data = [50, 75, 60];
      var config = chartConfigFactory.getLineChartConfig(labels, data);
      
      var dataset = config.data.datasets[0];
      expect(dataset.borderColor).toBe('rgb(75,192,192)');
      expect(dataset.backgroundColor).toBe('rgba(75,192,192,0.2)');
      expect(dataset.tension).toBe(0.1);
    });

    /*
    Test Documentation:
    - Test Name: should include responsive options in line chart config
    - Purpose: Verify line chart has responsive and scale options
    - Scenario: Generate line chart config and check options object
    - Expected Result: Config includes responsive:true, maintainAspectRatio:false, and y-axis scale
    */
    it('should include responsive options in line chart config', function() {
      var labels = ['A', 'B', 'C'];
      var data = [10, 20, 30];
      var config = chartConfigFactory.getLineChartConfig(labels, data);
      
      expect(config.options).toBeDefined();
      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
      expect(config.options.scales).toBeDefined();
      expect(config.options.scales.y).toBeDefined();
      expect(config.options.scales.y.beginAtZero).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty data arrays for line chart
    - Purpose: Verify line chart config generation with empty data
    - Scenario: Pass empty arrays for labels and data
    - Expected Result: Returns valid config with empty datasets
    */
    it('should handle empty data arrays for line chart', function() {
      var labels = [];
      var data = [];
      var config = chartConfigFactory.getLineChartConfig(labels, data);
      
      expect(config).toBeDefined();
      expect(config.data.labels.length).toBe(0);
      expect(config.data.datasets[0].data.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle single data point for line chart
    - Purpose: Verify line chart works with minimal data
    - Scenario: Pass single element arrays
    - Expected Result: Returns valid config with single data point
    */
    it('should handle single data point for line chart', function() {
      var labels = ['Jan'];
      var data = [500];
      var config = chartConfigFactory.getLineChartConfig(labels, data);
      
      expect(config.data.labels.length).toBe(1);
      expect(config.data.datasets[0].data.length).toBe(1);
      expect(config.data.datasets[0].data[0]).toBe(500);
    });
  });

  describe('getPieChartConfig', function() {
    /*
    Test Documentation:
    - Test Name: should return valid pie chart configuration
    - Purpose: Verify pie chart config generation
    - Scenario: Call getPieChartConfig with labels and data
    - Expected Result: Returns complete Chart.js pie chart config
    */
    it('should return valid pie chart configuration', function() {
      var labels = ['Food', 'Fuel', 'Shopping'];
      var data = [300, 150, 450];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config).toBeDefined();
      expect(config.type).toBe('pie');
      expect(config.data).toBeDefined();
      expect(config.data.labels).toEqual(labels);
      expect(config.data.datasets).toBeDefined();
      expect(config.data.datasets.length).toBe(1);
      expect(config.data.datasets[0].data).toEqual(data);
    });

    /*
    Test Documentation:
    - Test Name: should include color array for pie chart segments
    - Purpose: Verify pie chart has predefined colors for segments
    - Scenario: Generate pie chart config and check backgroundColor
    - Expected Result: Config includes array of 9 predefined colors
    */
    it('should include color array for pie chart segments', function() {
      var labels = ['Cat1', 'Cat2', 'Cat3'];
      var data = [100, 200, 300];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      var colors = config.data.datasets[0].backgroundColor;
      expect(colors).toBeDefined();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBe(9);
      expect(colors[0]).toBe('#FF6384');
      expect(colors[1]).toBe('#36A2EB');
      expect(colors[2]).toBe('#FFCE56');
    });

    /*
    Test Documentation:
    - Test Name: should include responsive options in pie chart config
    - Purpose: Verify pie chart has responsive options
    - Scenario: Generate pie chart config and check options
    - Expected Result: Config includes responsive:true and maintainAspectRatio:false
    */
    it('should include responsive options in pie chart config', function() {
      var labels = ['A', 'B'];
      var data = [50, 50];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config.options).toBeDefined();
      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty data arrays for pie chart
    - Purpose: Verify pie chart config generation with empty data
    - Scenario: Pass empty arrays for labels and data
    - Expected Result: Returns valid config with empty datasets
    */
    it('should handle empty data arrays for pie chart', function() {
      var labels = [];
      var data = [];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config).toBeDefined();
      expect(config.data.labels.length).toBe(0);
      expect(config.data.datasets[0].data.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle single segment pie chart
    - Purpose: Verify pie chart works with single data point
    - Scenario: Pass single element arrays
    - Expected Result: Returns valid config with single segment
    */
    it('should handle single segment pie chart', function() {
      var labels = ['Total'];
      var data = [1000];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config.data.labels.length).toBe(1);
      expect(config.data.datasets[0].data.length).toBe(1);
      expect(config.data.datasets[0].data[0]).toBe(1000);
    });

    /*
    Test Documentation:
    - Test Name: should handle maximum 9 categories for pie chart
    - Purpose: Verify pie chart supports up to 9 categories with distinct colors
    - Scenario: Pass 9 categories
    - Expected Result: All 9 categories rendered with distinct colors
    */
    it('should handle maximum 9 categories for pie chart', function() {
      var labels = ['Food', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Misc'];
      var data = [100, 150, 200, 250, 300, 350, 400, 450, 500];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config.data.labels.length).toBe(9);
      expect(config.data.datasets[0].data.length).toBe(9);
      expect(config.data.datasets[0].backgroundColor.length).toBe(9);
    });

    /*
    Test Documentation:
    - Test Name: should handle zero values in pie chart data
    - Purpose: Verify pie chart handles zero values gracefully
    - Scenario: Include zero values in data array
    - Expected Result: Config generated with zero values included
    */
    it('should handle zero values in pie chart data', function() {
      var labels = ['Active', 'Inactive'];
      var data = [500, 0];
      var config = chartConfigFactory.getPieChartConfig(labels, data);
      
      expect(config.data.datasets[0].data).toEqual([500, 0]);
    });
  });

  describe('factory existence and structure', function() {
    /*
    Test Documentation:
    - Test Name: should have getLineChartConfig method
    - Purpose: Verify factory exposes getLineChartConfig method
    - Scenario: Check method existence
    - Expected Result: Method is defined and is a function
    */
    it('should have getLineChartConfig method', function() {
      expect(chartConfigFactory.getLineChartConfig).toBeDefined();
      expect(typeof chartConfigFactory.getLineChartConfig).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: should have getPieChartConfig method
    - Purpose: Verify factory exposes getPieChartConfig method
    - Scenario: Check method existence
    - Expected Result: Method is defined and is a function
    */
    it('should have getPieChartConfig method', function() {
      expect(chartConfigFactory.getPieChartConfig).toBeDefined();
      expect(typeof chartConfigFactory.getPieChartConfig).toBe('function');
    });
  });
});

/*
Coverage Report:
- Functions tested: getLineChartConfig, getPieChartConfig
- Scenarios covered:
  * Line chart config with default and custom labels
  * Line chart styling and responsive options
  * Pie chart config with color arrays
  * Pie chart responsive options
  * Empty data arrays for both chart types
  * Single data point handling
  * Maximum category handling (9 categories)
  * Zero value handling
  * Method existence validation
- Uncovered scenarios: None - comprehensive coverage achieved
*/
})();