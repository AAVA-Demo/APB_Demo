/*
Test Documentation:
- Test Name: VisualizationFactory - createPieChart
- Purpose: Validates creation of pie chart for category-wise spending visualization
- Scenario: Factory creates Chart.js pie chart with labels, data, and colors
- Expected Result: Returns Chart instance configured as pie chart
*/
/*
Test Documentation:
- Test Name: VisualizationFactory - createLineChart
- Purpose: Validates creation of line chart for monthly trend visualization
- Scenario: Factory creates Chart.js line chart with time series data
- Expected Result: Returns Chart instance configured as line chart
*/
/*
Test Documentation:
- Test Name: VisualizationFactory - createBarChart
- Purpose: Validates creation of bar chart for category comparison
- Scenario: Factory creates Chart.js bar chart with category data
- Expected Result: Returns Chart instance configured as bar chart
*/
/*
Coverage Report:
- Functions tested: createPieChart, createLineChart, createBarChart
- Scenarios covered: chart creation with valid data, empty data, chart configuration validation
- Uncovered scenarios: none
*/

describe('VisualizationFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var VisualizationFactory;
  var mockCanvas, mockContext;
  
  beforeEach(inject(function(_VisualizationFactory_) {
    VisualizationFactory = _VisualizationFactory_;
    
    mockContext = {
      canvas: {},
      fillRect: jasmine.createSpy('fillRect'),
      clearRect: jasmine.createSpy('clearRect'),
      getImageData: jasmine.createSpy('getImageData'),
      putImageData: jasmine.createSpy('putImageData'),
      createImageData: jasmine.createSpy('createImageData'),
      setTransform: jasmine.createSpy('setTransform'),
      drawImage: jasmine.createSpy('drawImage'),
      save: jasmine.createSpy('save'),
      restore: jasmine.createSpy('restore'),
      beginPath: jasmine.createSpy('beginPath'),
      moveTo: jasmine.createSpy('moveTo'),
      lineTo: jasmine.createSpy('lineTo'),
      closePath: jasmine.createSpy('closePath'),
      stroke: jasmine.createSpy('stroke'),
      translate: jasmine.createSpy('translate'),
      scale: jasmine.createSpy('scale'),
      rotate: jasmine.createSpy('rotate'),
      arc: jasmine.createSpy('arc'),
      fill: jasmine.createSpy('fill'),
      measureText: jasmine.createSpy('measureText').and.returnValue({ width: 0 }),
      transform: jasmine.createSpy('transform'),
      rect: jasmine.createSpy('rect'),
      clip: jasmine.createSpy('clip')
    };
    
    mockCanvas = document.createElement('canvas');
    mockCanvas.id = 'test-chart';
    spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);
    spyOn(document, 'getElementById').and.returnValue(mockCanvas);
    
    window.Chart = jasmine.createSpy('Chart').and.returnValue({
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
      render: jasmine.createSpy('render')
    });
  }));
  
  describe('createPieChart', function() {
    it('should create pie chart with valid data', function() {
      var labels = ['Food', 'Fuel', 'Shopping'];
      var data = [500, 300, 200];
      var colors = ['#e74c3c', '#f39c12', '#9b59b6'];
      
      var chart = VisualizationFactory.createPieChart('test-chart', labels, data, colors);
      
      expect(document.getElementById).toHaveBeenCalledWith('test-chart');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(window.Chart).toHaveBeenCalled();
      expect(chart).toBeDefined();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('pie');
      expect(chartConfig.data.labels).toEqual(labels);
      expect(chartConfig.data.datasets[0].data).toEqual(data);
      expect(chartConfig.data.datasets[0].backgroundColor).toEqual(colors);
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
      expect(chartConfig.options.legend.position).toBe('right');
    });
    
    it('should handle empty data arrays', function() {
      var chart = VisualizationFactory.createPieChart('test-chart', [], [], []);
      
      expect(chart).toBeDefined();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels.length).toBe(0);
      expect(chartConfig.data.datasets[0].data.length).toBe(0);
    });
    
    it('should configure chart options correctly', function() {
      VisualizationFactory.createPieChart('test-chart', ['A'], [100], ['#fff']);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
      expect(chartConfig.options.legend).toBeDefined();
    });
  });
  
  describe('createLineChart', function() {
    it('should create line chart with valid data', function() {
      var labels = ['Jan', 'Feb', 'Mar'];
      var data = [1000, 1500, 1200];
      
      var chart = VisualizationFactory.createLineChart('test-chart', labels, data);
      
      expect(document.getElementById).toHaveBeenCalledWith('test-chart');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(window.Chart).toHaveBeenCalled();
      expect(chart).toBeDefined();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('line');
      expect(chartConfig.data.labels).toEqual(labels);
      expect(chartConfig.data.datasets[0].data).toEqual(data);
      expect(chartConfig.data.datasets[0].label).toBe('Monthly Spend');
      expect(chartConfig.data.datasets[0].borderColor).toBe('#3498db');
      expect(chartConfig.data.datasets[0].fill).toBe(true);
    });
    
    it('should configure line chart with proper styling', function() {
      VisualizationFactory.createLineChart('test-chart', ['A'], [100]);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.datasets[0].backgroundColor).toBe('rgba(52, 152, 219, 0.1)');
      expect(chartConfig.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });
    
    it('should handle empty data arrays', function() {
      var chart = VisualizationFactory.createLineChart('test-chart', [], []);
      
      expect(chart).toBeDefined();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels.length).toBe(0);
      expect(chartConfig.data.datasets[0].data.length).toBe(0);
    });
    
    it('should configure responsive options', function() {
      VisualizationFactory.createLineChart('test-chart', ['A'], [100]);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
    });
  });
  
  describe('createBarChart', function() {
    it('should create bar chart with valid data', function() {
      var labels = ['Food', 'Fuel', 'Shopping'];
      var data = [500, 300, 200];
      var colors = ['#e74c3c', '#f39c12', '#9b59b6'];
      
      var chart = VisualizationFactory.createBarChart('test-chart', labels, data, colors);
      
      expect(document.getElementById).toHaveBeenCalledWith('test-chart');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(window.Chart).toHaveBeenCalled();
      expect(chart).toBeDefined();
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('bar');
      expect(chartConfig.data.labels).toEqual(labels);
      expect(chartConfig.data.datasets[0].data).toEqual(data);
      expect(chartConfig.data.datasets[0].backgroundColor).toEqual(colors);
      expect(chartConfig.data.datasets[0].label).toBe('Spending by Category');
    });
    
    it('should configure bar chart with proper options', function() {
      VisualizationFactory.createBarChart('test-chart', ['A'], [100], ['#fff']);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
      expect(chartConfig.options.legend.display).toBe(false);
    });
    
    it('should handle empty data arrays', function() {
      var chart = VisualizationFactory.createBarChart('test-chart', [], [], []);
      
      expect(chart).toBeDefined();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels.length).toBe(0);
      expect(chartConfig.data.datasets[0].data.length).toBe(0);
    });
    
    it('should configure responsive options', function() {
      VisualizationFactory.createBarChart('test-chart', ['A'], [100], ['#fff']);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
    });
    
    it('should hide legend for bar charts', function() {
      VisualizationFactory.createBarChart('test-chart', ['A'], [100], ['#fff']);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.legend.display).toBe(false);
    });
  });
  
  describe('chart instance validation', function() {
    it('should return chart instance with destroy method', function() {
      var chart = VisualizationFactory.createPieChart('test-chart', ['A'], [100], ['#fff']);
      
      expect(chart.destroy).toBeDefined();
      expect(typeof chart.destroy).toBe('function');
    });
    
    it('should return chart instance with update method', function() {
      var chart = VisualizationFactory.createLineChart('test-chart', ['A'], [100]);
      
      expect(chart.update).toBeDefined();
      expect(typeof chart.update).toBe('function');
    });
    
    it('should return chart instance with render method', function() {
      var chart = VisualizationFactory.createBarChart('test-chart', ['A'], [100], ['#fff']);
      
      expect(chart.render).toBeDefined();
      expect(typeof chart.render).toBe('function');
    });
  });
});