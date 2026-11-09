/*
Test Documentation:
- Test Name: ChartConfigFactory configuration generation
- Purpose: Validates chart configuration objects for pie and line charts
- Scenario: Test configuration object structure and properties
- Expected Result: Factory should return correct configuration objects for different chart types
*/
/*
Coverage Report:
- Functions tested: getPieChartConfig, getLineChartConfig
- Scenarios covered: pie chart config, line chart config, property validation
- Dependencies mocked: none (pure factory)
- Uncovered scenarios: none
*/

describe('ChartConfigFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var factory;
  
  beforeEach(inject(function(_ChartConfigFactory_) {
    factory = _ChartConfigFactory_;
  }));
  
  it('should be defined', function() {
    expect(factory).toBeDefined();
  });
  
  it('should have getPieChartConfig method', function() {
    expect(factory.getPieChartConfig).toBeDefined();
    expect(typeof factory.getPieChartConfig).toBe('function');
  });
  
  it('should have getLineChartConfig method', function() {
    expect(factory.getLineChartConfig).toBeDefined();
    expect(typeof factory.getLineChartConfig).toBe('function');
  });
  
  it('should return pie chart configuration with correct properties', function() {
    var config = factory.getPieChartConfig();
    
    expect(config).toBeDefined();
    expect(config.responsive).toBe(true);
    expect(config.maintainAspectRatio).toBe(true);
    expect(config.legend).toBeDefined();
    expect(config.legend.display).toBe(true);
    expect(config.legend.position).toBe('bottom');
  });
  
  it('should return line chart configuration with correct properties', function() {
    var config = factory.getLineChartConfig();
    
    expect(config).toBeDefined();
    expect(config.responsive).toBe(true);
    expect(config.maintainAspectRatio).toBe(true);
    expect(config.scales).toBeDefined();
    expect(config.scales.yAxes).toBeDefined();
    expect(config.scales.yAxes[0].ticks.beginAtZero).toBe(true);
  });
  
  it('should return different configurations for different chart types', function() {
    var pieConfig = factory.getPieChartConfig();
    var lineConfig = factory.getLineChartConfig();
    
    expect(pieConfig).not.toEqual(lineConfig);
  });
  
  it('should return new configuration objects on each call', function() {
    var config1 = factory.getPieChartConfig();
    var config2 = factory.getPieChartConfig();
    
    expect(config1).not.toBe(config2);
  });
});