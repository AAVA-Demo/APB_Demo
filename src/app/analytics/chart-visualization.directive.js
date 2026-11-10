(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('chartVisualization', [function() {
      return {
        restrict: 'A',
        scope: {
          chartType: '@',
          chartData: '='
        },
        link: function(scope, element, attrs) {
          var chart = null;
          var renderChart = function() {
            if (!scope.chartData) return;
            var ctx = element[0].getContext('2d');
            if (chart) {
              chart.destroy();
            }
            var config = {
              type: scope.chartType || 'pie',
              data: scope.chartData,
              options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                  display: true,
                  position: 'bottom'
                }
              }
            };
            chart = new Chart(ctx, config);
          };
          scope.$watch('chartData', function(newVal) {
            if (newVal) {
              renderChart();
            }
          }, true);
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();