(function() {
  'use strict';
  angular.module('analyticsModule').directive('trendChart', function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<canvas id="trendChart" class="chart chart-line" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series"></canvas>'
    };
  });
})();