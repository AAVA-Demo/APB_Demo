(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="categoryChart" class="chart chart-pie" chart-data="chartData" chart-labels="chartLabels" chart-options="chartOptions"></canvas>',
        link: function(scope) {
          scope.chartLabels = [];
          scope.chartData = [];
          scope.chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
              display: true,
              position: 'right'
            }
          };
          
          scope.$watch('data', function(newData) {
            if (newData && newData.categoryBreakdown) {
              $timeout(function() {
                scope.chartLabels = newData.categoryBreakdown.map(function(item) {
                  return item.category;
                });
                scope.chartData = newData.categoryBreakdown.map(function(item) {
                  return item.total;
                });
              }, 100);
            }
          }, true);
        }
      };
    }]);
})();