/*
Test Documentation:
- Test Name: ChartConfigService - generateDonutConfig
- Purpose: Validates that generateDonutConfig creates valid Chart.js doughnut configuration
- Scenario: Service is called with category data and callback
- Expected Result: Returns configuration object with correct type, data, and options
*/
/*
Test Documentation:
- Test Name: ChartConfigService - generateLineConfig
- Purpose: Validates that generateLineConfig creates valid Chart.js line chart configuration
- Scenario: Service is called with trend data
- Expected Result: Returns configuration object with correct type, data, and scales
*/
/*
Test Documentation:
- Test Name: ChartConfigService - generateBarConfig
- Purpose: Validates that generateBarConfig creates valid Chart.js horizontal bar configuration
- Scenario: Service is called with card comparison data
- Expected Result: Returns configuration object with correct type, data, and options
*/
/*
Coverage Report:
- Functions tested: generateDonutConfig, generateLineConfig, generateBarConfig
- Scenarios covered: donut chart configuration, line chart configuration, bar chart configuration, callback handling
- Uncovered scenarios: empty data arrays, invalid data formats
*/

describe('ChartConfigService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  
  var ChartConfigService;
  
  beforeEach(inject(function(_ChartConfigService_) {
    ChartConfigService = _ChartConfigService_;
  }));
  
  describe('generateDonutConfig', function() {
    it('should generate valid doughnut chart configuration', function() {
      var categoryData = [
        {category: 'Food & Dining', amount: 8500, color: '#FF6384'},
        {category: 'Fuel', amount: 3200, color: '#36A2EB'}
      ];
      var callback = jasmine.createSpy('callback');
      
      var config = ChartConfigService.generateDonutConfig(categoryData, callback);
      
      expect(config).toBeDefined();
      expect(config.type).toBe('doughnut');
      expect(config.data.labels).toEqual(['Food & Dining', 'Fuel']);
      expect(config.data.datasets[0].data).toEqual([8500, 3200]);
      expect(config.data.datasets[0].backgroundColor).toEqual(['#FF6384', '#36A2EB']);
      expect(config.options.responsive).toBe(true);
    });
    
    it('should include onClick callback in configuration', function() {
      var categoryData = [{category: 'Food & Dining', amount: 8500, color: '#FF6384'}];
      var callback = jasmine.createSpy('callback');
      
      var config = ChartConfigService.generateDonutConfig(categoryData, callback);
      
      expect(config.options.onClick).toBeDefined();
      expect(typeof config.options.onClick).toBe('function');
    });
  });
  
  describe('generateLineConfig', function() {
    it('should generate valid line chart configuration', function() {
      var trendData = [
        {month: '2024-01', totalSpend: 25000},
        {month: '2024-02', totalSpend: 28000}
      ];
      
      var config = ChartConfigService.generateLineConfig(trendData);
      
      expect(config).toBeDefined();
      expect(config.type).toBe('line');
      expect(config.data.labels).toEqual(['2024-01', '2024-02']);
      expect(config.data.datasets[0].data).toEqual([25000, 28000]);
      expect(config.data.datasets[0].label).toBe('Total Spend');
      expect(config.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });
    
    it('should include currency formatting in y-axis', function() {
      var trendData = [{month: '2024-01', totalSpend: 25000}];
      
      var config = ChartConfigService.generateLineConfig(trendData);
      
      expect(config.options.scales.yAxes[0].ticks.callback).toBeDefined();
      var formatted = config.options.scales.yAxes[0].ticks.callback(1000);
      expect(formatted).toContain('$');
    });
  });
  
  describe('generateBarConfig', function() {
    it('should generate valid horizontal bar chart configuration', function() {
      var cardData = [
        {cardId: 'c1', cardNumber: '**** 1234', totalSpend: 12000},
        {cardId: 'c2', cardNumber: '**** 5678', totalSpend: 8000}
      ];
      
      var config = ChartConfigService.generateBarConfig(cardData);
      
      expect(config).toBeDefined();
      expect(config.type).toBe('horizontalBar');
      expect(config.data.labels).toEqual(['**** 1234', '**** 5678']);
      expect(config.data.datasets[0].data).toEqual([12000, 8000]);
      expect(config.options.scales.xAxes[0].ticks.beginAtZero).toBe(true);
    });
    
    it('should include currency formatting in x-axis', function() {
      var cardData = [{cardId: 'c1', cardNumber: '**** 1234', totalSpend: 12000}];
      
      var config = ChartConfigService.generateBarConfig(cardData);
      
      expect(config.options.scales.xAxes[0].ticks.callback).toBeDefined();
      var formatted = config.options.scales.xAxes[0].ticks.callback(5000);
      expect(formatted).toContain('$');
    });
  });
});