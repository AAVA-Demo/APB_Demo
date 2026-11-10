(function() {
  'use strict';
  angular.module('analyticsModule').directive('trendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<div class="chart-container"><h4>Monthly Spending Trend</h4><canvas id="trendChart" class="chart chart-line" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series" chart-options="chartData.options"></canvas></div>'
    };
  }]);
})();