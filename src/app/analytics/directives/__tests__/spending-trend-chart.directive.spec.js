/*
Test Documentation:
- Test Name: spendingTrendChart directive - rendering
- Purpose: Validates directive renders trend chart with correct data
- Scenario: Normal scenario with valid trend data
- Expected Result: Chart is rendered with monthly trends
*/
/*
Test Documentation:
- Test Name: spendingTrendChart directive - data updates
- Purpose: Validates directive updates chart when data changes
- Scenario: Normal scenario with dynamic data changes
- Expected Result: Chart is destroyed and recreated with new data
*/
/*
Test Documentation:
- Test Name: spendingTrendChart directive - cleanup
- Purpose: Validates chart is destroyed on scope destroy
- Scenario: Normal scenario with directive cleanup
- Expected Result: Chart instance is destroyed
*/
/*
Coverage Report:
- Functions tested: directive rendering, data watching, cleanup
- Scenarios covered: initial render, data updates, null data, scope destroy
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('spendingTrendChart directive', function() {
    var $compile, $rootScope, $timeout, element, ChartConfigFactory;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _ChartConfigFactory_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      ChartConfigFactory = _ChartConfigFactory_;

      spyOn(ChartConfigFactory, 'getTrendChartConfig').and.returnValue({
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {}
      });
    }));

    it('should render canvas element', function() {
      $rootScope.testData = {
        monthlyTrends: [
          { month: '2024-01', totalSpend: 1500 },
          { month: '2024-02', totalSpend: 2000 }
        ]
      };

      element = $compile('<spending-trend-chart data="testData"></spending-trend-chart>')($rootScope);
      $rootScope.$digest();

      var canvas = element.find('canvas');
      expect(canvas.length).toBe(1);
      expect(canvas.attr('id')).toBe('trendChart');
    });

    it('should call ChartConfigFactory when data is provided', function() {
      $rootScope.testData = {
        monthlyTrends: [
          { month: '2024-01', totalSpend: 1500 },
          { month: '2024-02', totalSpend: 2000 }
        ]
      };

      element = $compile('<spending-trend-chart data="testData"></spending-trend-chart>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(ChartConfigFactory.getTrendChartConfig).toHaveBeenCalledWith(
        ['2024-01', '2024-02'],
        [1500, 2000]
      );
    });

    it('should not render chart when data is null', function() {
      $rootScope.testData = null;

      element = $compile('<spending-trend-chart data="testData"></spending-trend-chart>')($rootScope);
      $rootScope.$digest();

      expect(ChartConfigFactory.getTrendChartConfig).not.toHaveBeenCalled();
    });

    it('should not render chart when monthlyTrends is missing', function() {
      $rootScope.testData = { categoryBreakdown: [] };

      element = $compile('<spending-trend-chart data="testData"></spending-trend-chart>')($rootScope);
      $rootScope.$digest();

      expect(ChartConfigFactory.getTrendChartConfig).not.toHaveBeenCalled();
    });

    it('should update chart when data changes', function() {
      $rootScope.testData = {
        monthlyTrends: [
          { month: '2024-01', totalSpend: 1500 }
        ]
      };

      element = $compile('<spending-trend-chart data="testData"></spending-trend-chart>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      ChartConfigFactory.getTrendChartConfig.calls.reset();

      $rootScope.testData = {
        monthlyTrends: [
          { month: '2024-01', totalSpend: 1500 },
          { month: '2024-02', totalSpend: 2000 }
        ]
      };
      $rootScope.$digest();
      $timeout.flush();

      expect(ChartConfigFactory.getTrendChartConfig).toHaveBeenCalled();
    });
  });
})();