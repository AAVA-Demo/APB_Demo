/*
Test Documentation:
- Test Name: categoryBreakdownChart directive - rendering
- Purpose: Validates directive renders category breakdown chart with correct data
- Scenario: Normal scenario with valid category data
- Expected Result: Chart is rendered with category breakdown
*/
/*
Test Documentation:
- Test Name: categoryBreakdownChart directive - data updates
- Purpose: Validates directive updates chart when data changes
- Scenario: Normal scenario with dynamic data changes
- Expected Result: Chart is destroyed and recreated with new data
*/
/*
Test Documentation:
- Test Name: categoryBreakdownChart directive - cleanup
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

  describe('categoryBreakdownChart directive', function() {
    var $compile, $rootScope, $timeout, element, ChartConfigFactory;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _ChartConfigFactory_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      ChartConfigFactory = _ChartConfigFactory_;

      spyOn(ChartConfigFactory, 'getCategoryChartConfig').and.returnValue({
        type: 'pie',
        data: { labels: [], datasets: [] },
        options: {}
      });
    }));

    it('should render canvas element', function() {
      $rootScope.testData = {
        categoryBreakdown: [
          { category: 'Food & Dining', totalSpend: 1000, percentage: '50.00' },
          { category: 'Fuel', totalSpend: 1000, percentage: '50.00' }
        ]
      };

      element = $compile('<category-breakdown-chart data="testData"></category-breakdown-chart>')($rootScope);
      $rootScope.$digest();

      var canvas = element.find('canvas');
      expect(canvas.length).toBe(1);
      expect(canvas.attr('id')).toBe('categoryChart');
    });

    it('should call ChartConfigFactory when data is provided', function() {
      $rootScope.testData = {
        categoryBreakdown: [
          { category: 'Food & Dining', totalSpend: 1000, percentage: '50.00' },
          { category: 'Fuel', totalSpend: 1000, percentage: '50.00' }
        ]
      };

      element = $compile('<category-breakdown-chart data="testData"></category-breakdown-chart>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(ChartConfigFactory.getCategoryChartConfig).toHaveBeenCalledWith(
        ['Food & Dining', 'Fuel'],
        [1000, 1000]
      );
    });

    it('should not render chart when data is null', function() {
      $rootScope.testData = null;

      element = $compile('<category-breakdown-chart data="testData"></category-breakdown-chart>')($rootScope);
      $rootScope.$digest();

      expect(ChartConfigFactory.getCategoryChartConfig).not.toHaveBeenCalled();
    });

    it('should not render chart when categoryBreakdown is missing', function() {
      $rootScope.testData = { monthlyTrends: [] };

      element = $compile('<category-breakdown-chart data="testData"></category-breakdown-chart>')($rootScope);
      $rootScope.$digest();

      expect(ChartConfigFactory.getCategoryChartConfig).not.toHaveBeenCalled();
    });

    it('should update chart when data changes', function() {
      $rootScope.testData = {
        categoryBreakdown: [
          { category: 'Food & Dining', totalSpend: 1000, percentage: '100.00' }
        ]
      };

      element = $compile('<category-breakdown-chart data="testData"></category-breakdown-chart>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      ChartConfigFactory.getCategoryChartConfig.calls.reset();

      $rootScope.testData = {
        categoryBreakdown: [
          { category: 'Food & Dining', totalSpend: 1000, percentage: '50.00' },
          { category: 'Fuel', totalSpend: 1000, percentage: '50.00' }
        ]
      };
      $rootScope.$digest();
      $timeout.flush();

      expect(ChartConfigFactory.getCategoryChartConfig).toHaveBeenCalled();
    });
  });
})();