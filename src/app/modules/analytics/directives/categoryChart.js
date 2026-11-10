(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<div class="chart-container"><h4>Category-wise Spending</h4><canvas id="categoryChart" class="chart chart-doughnut" chart-data="chartData.data" chart-labels="chartData.labels" chart-colors="chartData.colors" chart-options="chartData.options"></canvas></div>'
    };
  }]);
})();