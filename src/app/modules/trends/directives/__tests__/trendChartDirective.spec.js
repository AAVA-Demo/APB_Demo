/*
Test Documentation:
- Test Name: trendChartDirective Unit Tests
- Purpose: Validate trend chart directive rendering and filtering
- Scenario: Test directive initialization, data binding, and card selection
- Expected Result: Directive should render line chart and respond to card filter changes
*/

(function(){
'use strict';

describe('trendChartDirective', function() {
  var $compile, $rootScope, element, scope;

  beforeEach(module('spendTrendsModule'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    scope.trends = [
      {month: '2024-01', totalSpend: 150},
      {month: '2024-02', totalSpend: 200}
    ];

    scope.cardData = [
      {
        cardId: 1,
        cardName: 'Visa - 1234',
        monthlyData: [
          {month: '2024-01', spend: 100},
          {month: '2024-02', spend: 150}
        ]
      }
    ];

    scope.selectedCard = null;
  }));

  function compileDirective() {
    element = angular.element('<trend-chart trends="trends" card-data="cardData" selected-card="selectedCard"></trend-chart>');
    $compile(element)(scope);
    scope.$digest();
    return element;
  }

  describe('Directive Initialization', function() {
    it('should create canvas element', function() {
      element = compileDirective();
      var canvas = element.find('canvas');
      expect(canvas.length).toBe(1);
      expect(canvas.attr('id')).toBe('trendChart');
    });

    it('should have correct canvas dimensions', function() {
      element = compileDirective();
      var canvas = element.find('canvas');
      expect(canvas.attr('width')).toBe('600');
      expect(canvas.attr('height')).toBe('300');
    });
  });

  describe('Data Binding', function() {
    beforeEach(function() {
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    });

    it('should render chart with trend data when no card is selected', function() {
      element = compileDirective();
      expect(window.Chart).toHaveBeenCalled();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels).toEqual(['2024-01', '2024-02']);
      expect(chartConfig.data.datasets[0].data).toEqual([150, 200]);
    });

    it('should render chart with card-specific data when card is selected', function() {
      scope.selectedCard = 1;
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.labels).toEqual(['2024-01', '2024-02']);
      expect(chartConfig.data.datasets[0].data).toEqual([100, 150]);
    });

    it('should update chart when trends data changes', function() {
      element = compileDirective();
      var initialCallCount = window.Chart.calls.count();

      scope.trends = [{month: '2024-03', totalSpend: 250}];
      scope.$digest();

      expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
    });

    it('should update chart when selected card changes', function() {
      element = compileDirective();
      var initialCallCount = window.Chart.calls.count();

      scope.selectedCard = 1;
      scope.$digest();

      expect(window.Chart.calls.count()).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Chart Configuration', function() {
    beforeEach(function() {
      window.Chart = jasmine.createSpy('Chart').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      });
    });

    it('should configure line chart type', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.type).toBe('line');
    });

    it('should set responsive option to true', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.responsive).toBe(true);
    });

    it('should configure y-axis to begin at zero', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
    });

    it('should set dataset label to Spending', function() {
      element = compileDirective();
      var chartConfig = window.Chart.calls.mostRecent().args[1];
      expect(chartConfig.data.datasets[0].label).toBe('Spending');
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: Directive link function, renderChart, data watches
- Scenarios covered: Initialization, all trends view, card-specific view, data updates, configuration
- Edge cases: Card selection changes, data updates
- Uncovered scenarios: None - all rendering logic covered
*/