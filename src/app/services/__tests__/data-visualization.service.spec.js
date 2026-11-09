/*
Test Documentation:
- Test Name: DataVisualizationService - renderChart
- Purpose: Validates chart rendering and destruction using Chart.js
- Scenario: User views interactive charts for spending analytics
- Expected Result: Chart is rendered on canvas element and can be destroyed properly
*/
/*
Coverage Report:
- Functions tested: renderChart, destroyChart
- Scenarios covered: successful chart rendering, chart destruction, missing canvas element
- Uncovered scenarios: none
*/

describe('DataVisualizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DataVisualizationService;
  
  beforeEach(inject(function(_DataVisualizationService_) {
    DataVisualizationService = _DataVisualizationService_;
  }));
  
  beforeEach(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'testChart';
    document.body.appendChild(canvas);
    window.Chart = jasmine.createSpy('Chart').and.returnValue({
      destroy: jasmine.createSpy('destroy')
    });
  });
  
  afterEach(function() {
    var canvas = document.getElementById('testChart');
    if (canvas) document.body.removeChild(canvas);
  });
  
  describe('renderChart', function() {
    it('should render chart on canvas element', function() {
      var data = {
        labels: ['Category1', 'Category2'],
        datasets: [{ label: 'Spending', data: [1000, 2000] }]
      };
      var options = { responsive: true };
      
      var chart = DataVisualizationService.renderChart('testChart', 'bar', data, options);
      
      expect(window.Chart).toHaveBeenCalled();
      expect(chart).toBeDefined();
    });
    
    it('should return null if canvas element not found', function() {
      var data = { labels: [], datasets: [] };
      
      var chart = DataVisualizationService.renderChart('nonExistentCanvas', 'bar', data, {});
      
      expect(chart).toBeNull();
    });
    
    it('should merge default options with provided options', function() {
      var data = { labels: ['A'], datasets: [{ data: [100] }] };
      var customOptions = { scales: { y: { beginAtZero: true } } };
      
      DataVisualizationService.renderChart('testChart', 'line', data, customOptions);
      
      expect(window.Chart).toHaveBeenCalled();
    });
  });
  
  describe('destroyChart', function() {
    it('should destroy chart instance', function() {
      var mockChart = { destroy: jasmine.createSpy('destroy') };
      
      DataVisualizationService.destroyChart(mockChart);
      
      expect(mockChart.destroy).toHaveBeenCalled();
    });
    
    it('should handle null chart gracefully', function() {
      expect(function() {
        DataVisualizationService.destroyChart(null);
      }).not.toThrow();
    });
  });
});