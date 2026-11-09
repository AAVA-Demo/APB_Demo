(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartType: '@',
          chartData: '=',
          chartLabels: '=',
          chartOptions: '=',
          chartSeries: '='
        },
        template: '<canvas class="chart chart-{{chartType}}" chart-data="chartData" chart-labels="chartLabels" chart-options="chartOptions" chart-series="chartSeries"></canvas>'
      };
    }]);
})();