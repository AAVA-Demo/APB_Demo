(function() {
  'use strict';
  angular.module('analyticsModule').directive('cardComparisonChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<div class="chart-container"><h4>Card-wise Spending Comparison</h4><canvas id="cardComparisonChart" class="chart chart-bar" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series" chart-options="chartData.options"></canvas></div>'
    };
  }]);
})();