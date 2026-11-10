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
          chartSeries: '='
        },
        template: '<canvas class="chart chart-{{ chartType }}" ' +
                  '        chart-data="chartData" ' +
                  '        chart-labels="chartLabels" ' +
                  '        chart-series="chartSeries" ' +
                  '        chart-options="chartOptions">' +
                  '</canvas>',
        link: function(scope) {
          scope.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: true }
          };
        }
      };
    }]);
})();