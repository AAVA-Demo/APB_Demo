(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('chartDirective', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartLabels: '=',
          chartOptions: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          function renderChart() {
            if (chart) {
              chart.destroy();
            }
            var ctx = element.find('canvas')[0].getContext('2d');
            var config = {
              type: scope.chartType || 'bar',
              data: {
                labels: scope.chartLabels || [],
                datasets: [{
                  data: scope.chartData || [],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(83, 102, 255, 0.6)',
                    'rgba(255, 99, 255, 0.6)'
                  ],
                  borderWidth: 1
                }]
              },
              options: scope.chartOptions || {
                responsive: true,
                maintainAspectRatio: false
              }
            };
            chart = new Chart(ctx, config);
          }
          scope.$watchGroup(['chartData', 'chartLabels'], function(newVals) {
            if (newVals[0] && newVals[1]) {
              renderChart();
            }
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();