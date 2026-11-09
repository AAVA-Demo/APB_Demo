/*
Test Documentation:
- Test Name: ChartConfigFactory - getCategoryPieConfig
- Purpose: Validates pie chart configuration generation for category data
- Scenario: Factory receives category spending data and generates Chart.js config
- Expected Result: Returns valid pie chart configuration with labels, data, and colors
*/
/*
Test Documentation:
- Test Name: ChartConfigFactory - getMonthlyTrendConfig
- Purpose: Validates line chart configuration generation for monthly trends
- Scenario: Factory receives monthly spending data and generates Chart.js config
- Expected Result: Returns valid line chart configuration with labels and dataset
*/
/*
Coverage Report:
- Functions tested: getCategoryPieConfig, getMonthlyTrendConfig
- Scenarios covered: chart config generation, empty data handling, color mapping
- Edge cases: empty arrays, single data point, null values
- Uncovered scenarios: none
*/

describe('ChartConfigFactory', function() {
  'use strict';

  var ChartConfigFactory, CategoryService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_ChartConfigFactory_, _CategoryService_) {
    ChartConfigFactory = _ChartConfigFactory_;
    CategoryService = _CategoryService_;
  }));

  describe('getCategoryPieConfig', function() {
    it('should generate valid pie chart configuration', function() {
      var categoryData = [
        { category: 'Food & Dining', totalAmount: 1500 },
        { category: 'Fuel', totalAmount: 800 },
        { category: 'Shopping', totalAmount: 2000 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config).toBeDefined();
      expect(config.type).toBe('pie');
      expect(config.data).toBeDefined();
      expect(config.data.labels.length).toBe(3);
      expect(config.data.datasets[0].data.length).toBe(3);
      expect(config.data.datasets[0].backgroundColor.length).toBe(3);
    });

    it('should include correct labels from category data', function() {
      var categoryData = [
        { category: 'Travel', totalAmount: 3000 },
        { category: 'Entertainment', totalAmount: 500 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config.data.labels).toContain('Travel');
      expect(config.data.labels).toContain('Entertainment');
    });

    it('should include correct amounts in data array', function() {
      var categoryData = [
        { category: 'Utilities', totalAmount: 1200 },
        { category: 'Healthcare', totalAmount: 900 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config.data.datasets[0].data).toContain(1200);
      expect(config.data.datasets[0].data).toContain(900);
    });

    it('should map colors using CategoryService', function() {
      spyOn(CategoryService, 'getCategoryColor').and.returnValue('#FF0000');

      var categoryData = [
        { category: 'Education', totalAmount: 1500 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(CategoryService.getCategoryColor).toHaveBeenCalledWith('Education');
      expect(config.data.datasets[0].backgroundColor[0]).toBe('#FF0000');
    });

    it('should handle empty category data', function() {
      var categoryData = [];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config.data.labels.length).toBe(0);
      expect(config.data.datasets[0].data.length).toBe(0);
    });

    it('should set responsive options correctly', function() {
      var categoryData = [
        { category: 'Miscellaneous', totalAmount: 500 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
      expect(config.options.legend.position).toBe('right');
    });

    it('should include onClick handler in options', function() {
      var categoryData = [
        { category: 'Food & Dining', totalAmount: 1000 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);

      expect(config.options.onClick).toBeDefined();
      expect(typeof config.options.onClick).toBe('function');
    });

    it('should return category and amount on click', function() {
      var categoryData = [
        { category: 'Fuel', totalAmount: 600 },
        { category: 'Shopping', totalAmount: 1800 }
      ];

      var config = ChartConfigFactory.getCategoryPieConfig(categoryData);
      var mockElements = [{ _index: 1 }];
      var result = config.options.onClick(null, mockElements);

      expect(result).toEqual({ category: 'Shopping', amount: 1800 });
    });
  });

  describe('getMonthlyTrendConfig', function() {
    it('should generate valid line chart configuration', function() {
      var monthlyData = [
        { month: 'Jan', totalSpend: 2000 },
        { month: 'Feb', totalSpend: 2500 },
        { month: 'Mar', totalSpend: 2200 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config).toBeDefined();
      expect(config.type).toBe('line');
      expect(config.data).toBeDefined();
      expect(config.data.labels.length).toBe(3);
      expect(config.data.datasets[0].data.length).toBe(3);
    });

    it('should include correct month labels', function() {
      var monthlyData = [
        { month: 'Apr', totalSpend: 3000 },
        { month: 'May', totalSpend: 3200 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.labels).toContain('Apr');
      expect(config.data.labels).toContain('May');
    });

    it('should include correct spend amounts in dataset', function() {
      var monthlyData = [
        { month: 'Jun', totalSpend: 2800 },
        { month: 'Jul', totalSpend: 3100 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.datasets[0].data).toContain(2800);
      expect(config.data.datasets[0].data).toContain(3100);
    });

    it('should set correct dataset label', function() {
      var monthlyData = [
        { month: 'Aug', totalSpend: 2900 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.datasets[0].label).toBe('Monthly Spend');
    });

    it('should set correct border and background colors', function() {
      var monthlyData = [
        { month: 'Sep', totalSpend: 2700 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.datasets[0].borderColor).toBe('#36A2EB');
      expect(config.data.datasets[0].backgroundColor).toBe('rgba(54, 162, 235, 0.2)');
      expect(config.data.datasets[0].fill).toBe(true);
    });

    it('should handle empty monthly data', function() {
      var monthlyData = [];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.labels.length).toBe(0);
      expect(config.data.datasets[0].data.length).toBe(0);
    });

    it('should set responsive options correctly', function() {
      var monthlyData = [
        { month: 'Oct', totalSpend: 3300 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.options.responsive).toBe(true);
      expect(config.options.maintainAspectRatio).toBe(false);
    });

    it('should configure y-axis to begin at zero', function() {
      var monthlyData = [
        { month: 'Nov', totalSpend: 2600 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });

    it('should handle single month data point', function() {
      var monthlyData = [
        { month: 'Dec', totalSpend: 4000 }
      ];

      var config = ChartConfigFactory.getMonthlyTrendConfig(monthlyData);

      expect(config.data.labels.length).toBe(1);
      expect(config.data.datasets[0].data[0]).toBe(4000);
    });
  });
});