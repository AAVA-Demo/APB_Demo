/*
Test Documentation:
- Test Name: VisualizationService - renderChart success
- Purpose: Validates chart rendering with Chart.js
- Scenario: Analytics view requests chart rendering
- Expected Result: Chart instance created with correct configuration
*/
/*
Test Documentation:
- Test Name: VisualizationService - updateChart
- Purpose: Validates chart data update functionality
- Scenario: User changes date range and chart needs update
- Expected Result: Chart data updated and re-rendered
*/
/*
Test Documentation:
- Test Name: VisualizationService - destroyChart
- Purpose: Validates proper chart cleanup
- Scenario: User navigates away from analytics view
- Expected Result: Chart instance destroyed to prevent memory leaks
*/
/*
Coverage Report:
- Functions tested: renderChart, updateChart, destroyChart
- Scenarios covered: chart creation, data updates, cleanup, null handling
- Uncovered scenarios: invalid canvas ID, Chart.js library not loaded
*/

describe('VisualizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var VisualizationService;
  var mockCanvas, mockChart;
  
  beforeEach(inject(function(_VisualizationService_) {
    VisualizationService = _VisualizationService_;
    
    // Mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.id = 'testChart';
    document.body.appendChild(mockCanvas);
    
    // Mock Chart constructor
    mockChart = {
      data: {},
      update: jasmine.createSpy('update'),
      destroy: jasmine.createSpy('destroy')
    };
    
    window.Chart = jasmine.createSpy('Chart').and.returnValue(mockChart);
  }));
  
  afterEach(function() {
    if (mockCanvas && mockCanvas.parentNode) {
      mockCanvas.parentNode.removeChild(mockCanvas);
    }
  });
  
  describe('renderChart', function() {
    it('should create chart with correct configuration', function() {
      var canvasId = 'testChart';
      var type = 'pie';
      var data = {
        labels: ['Food', 'Fuel', 'Shopping'],
        datasets: [{ data: [500, 200, 300] }]
      };
      var options = { title: { text: 'Category Spending' } };
      
      var chart = VisualizationService.renderChart(canvasId, type, data, options);
      
      expect(window.Chart).toHaveBeenCalled();
      expect(chart).toBe(mockChart);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe(type);
      expect(chartConfig.data).toBe(data);
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
      expect(chartConfig.options.animation.duration).toBe(800);
    });
    
    it('should merge provided options with defaults', function() {
      var canvasId = 'testChart';
      var type = 'line';
      var data = { labels: [], datasets: [] };
      var customOptions = {
        scales: { y: { beginAtZero: true } }
      };
      
      VisualizationService.renderChart(canvasId, type, data, customOptions);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.scales.y.beginAtZero).toBe(true);
    });
    
    it('should return null when canvas element does not exist', function() {
      var chart = VisualizationService.renderChart('nonExistentCanvas', 'bar', {}, {});
      
      expect(chart).toBeNull();
      expect(window.Chart).not.toHaveBeenCalled();
    });
    
    it('should use default options when none provided', function() {
      var canvasId = 'testChart';
      var type = 'bar';
      var data = { labels: [], datasets: [] };
      
      VisualizationService.renderChart(canvasId, type, data);
      
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
      expect(chartConfig.options.maintainAspectRatio).toBe(false);
      expect(chartConfig.options.animation.duration).toBe(800);
    });
  });
  
  describe('updateChart', function() {
    it('should update chart data and call update method', function() {
      var newData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ data: [100, 200, 300] }]
      };
      
      VisualizationService.updateChart(mockChart, newData);
      
      expect(mockChart.data).toBe(newData);
      expect(mockChart.update).toHaveBeenCalled();
    });
    
    it('should handle null chart gracefully', function() {
      var newData = { labels: [], datasets: [] };
      
      expect(function() {
        VisualizationService.updateChart(null, newData);
      }).not.toThrow();
    });
    
    it('should handle null data gracefully', function() {
      expect(function() {
        VisualizationService.updateChart(mockChart, null);
      }).not.toThrow();
      
      expect(mockChart.update).not.toHaveBeenCalled();
    });
    
    it('should handle both chart and data being null', function() {
      expect(function() {
        VisualizationService.updateChart(null, null);
      }).not.toThrow();
    });
  });
  
  describe('destroyChart', function() {
    it('should call destroy method on chart', function() {
      VisualizationService.destroyChart(mockChart);
      
      expect(mockChart.destroy).toHaveBeenCalled();
    });
    
    it('should handle null chart gracefully', function() {
      expect(function() {
        VisualizationService.destroyChart(null);
      }).not.toThrow();
    });
    
    it('should handle undefined chart gracefully', function() {
      expect(function() {
        VisualizationService.destroyChart(undefined);
      }).not.toThrow();
    });
  });
});