/*
Test Documentation:
- Test Name: DataVisualizationService - renderCategoryChart
- Purpose: Validates that renderCategoryChart creates a bar chart with correct data
- Scenario: User requests category spending visualization
- Expected Result: Chart.js bar chart is created with category labels and spending values
*/
/*
Test Documentation:
- Test Name: DataVisualizationService - renderTrendChart
- Purpose: Validates that renderTrendChart creates a line chart with correct data
- Scenario: User requests monthly trend visualization
- Expected Result: Chart.js line chart is created with month labels and spending values
*/
/*
Coverage Report:
- Functions tested: renderCategoryChart, renderTrendChart
- Scenarios covered: bar chart creation, line chart creation, data mapping
- Uncovered scenarios: none
*/

describe('DataVisualizationService', function() {
  'use strict';

  var DataVisualizationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_DataVisualizationService_) {
    DataVisualizationService = _DataVisualizationService_;
  }));

  beforeEach(function() {
    window.Chart = jasmine.createSpy('Chart');
  });

  describe('renderCategoryChart', function() {
    it('should create a bar chart with category data', function() {
      var mockCanvas = document.createElement('canvas');
      mockCanvas.id = 'testCategoryChart';
      document.body.appendChild(mockCanvas);

      var mockData = [
        {category: 'Food & Dining', totalSpend: 5000},
        {category: 'Fuel', totalSpend: 3000},
        {category: 'Shopping', totalSpend: 7000}
      ];

      DataVisualizationService.renderCategoryChart('testCategoryChart', mockData);

      expect(window.Chart).toHaveBeenCalled();
      var chartCall = window.Chart.calls.mostRecent();
      expect(chartCall.args[1].type).toBe('bar');
      expect(chartCall.args[1].data.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
      expect(chartCall.args[1].data.datasets[0].data).toEqual([5000, 3000, 7000]);
      expect(chartCall.args[1].data.datasets[0].label).toBe('Spending by Category');

      document.body.removeChild(mockCanvas);
    });

    it('should configure chart with responsive options', function() {
      var mockCanvas = document.createElement('canvas');
      mockCanvas.id = 'testChart2';
      document.body.appendChild(mockCanvas);

      DataVisualizationService.renderCategoryChart('testChart2', []);

      var chartCall = window.Chart.calls.mostRecent();
      expect(chartCall.args[1].options.responsive).toBe(true);
      expect(chartCall.args[1].options.maintainAspectRatio).toBe(false);

      document.body.removeChild(mockCanvas);
    });
  });

  describe('renderTrendChart', function() {
    it('should create a line chart with monthly trend data', function() {
      var mockCanvas = document.createElement('canvas');
      mockCanvas.id = 'testTrendChart';
      document.body.appendChild(mockCanvas);

      var mockData = [
        {month: '2024-01', totalSpend: 10000},
        {month: '2024-02', totalSpend: 12000},
        {month: '2024-03', totalSpend: 11000}
      ];

      DataVisualizationService.renderTrendChart('testTrendChart', mockData);

      expect(window.Chart).toHaveBeenCalled();
      var chartCall = window.Chart.calls.mostRecent();
      expect(chartCall.args[1].type).toBe('line');
      expect(chartCall.args[1].data.labels).toEqual(['2024-01', '2024-02', '2024-03']);
      expect(chartCall.args[1].data.datasets[0].data).toEqual([10000, 12000, 11000]);
      expect(chartCall.args[1].data.datasets[0].label).toBe('Monthly Spend Trend');

      document.body.removeChild(mockCanvas);
    });

    it('should configure line chart with fill and border color', function() {
      var mockCanvas = document.createElement('canvas');
      mockCanvas.id = 'testChart3';
      document.body.appendChild(mockCanvas);

      DataVisualizationService.renderTrendChart('testChart3', []);

      var chartCall = window.Chart.calls.mostRecent();
      expect(chartCall.args[1].data.datasets[0].borderColor).toBe('#007bff');
      expect(chartCall.args[1].data.datasets[0].fill).toBe(true);

      document.body.removeChild(mockCanvas);
    });
  });
});