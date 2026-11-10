(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'A',
        scope: {
          chartData: '=',
          chartType: '@',
          onClick: '&'
        },
        template: '<canvas id="{{chartId}}" class="chart-canvas"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          scope.$watch('chartData', function(newData) {
            if (newData && newData.labels) {
              renderChart();
            }
          });
          function renderChart() {
            var canvas = element.find('canvas')[0];
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            if (scope.chart) {
              scope.chart.destroy();
            }
            var config = {
              type: scope.chartType || 'pie',
              data: {
                labels: scope.chartData.labels,
                datasets: scope.chartData.datasets || [{
                  data: scope.chartData.data,
                  backgroundColor: scope.chartData.colors
                }]
              },
              options: scope.chartData.options || {responsive: true}
            };
            if (scope.onClick) {
              config.options.onClick = function(evt, items) {
                scope.onClick({points: items, evt: evt});
              };
            }
            scope.chart = new Chart(ctx, config);
          }
          scope.$on('$destroy', function() {
            if (scope.chart) {
              scope.chart.destroy();
            }
          });
        }
      };
    }]);
})();