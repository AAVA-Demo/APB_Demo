(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryChart', function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<canvas id="categoryChart" class="chart chart-pie" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series"></canvas>'
    };
  });
})();