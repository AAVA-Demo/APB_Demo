(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartLabels: '=',
          chartType: '@'
        },
        template: '<canvas id="spending-chart-canvas" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chart;
          function renderChart() {
            if (chart) chart.destroy();
            if (!scope.chartData || !scope.chartLabels) return;
            chart = new Chart(ctx, {
              type: scope.chartType || 'bar',
              data: {
                labels: scope.chartLabels,
                datasets: [{
                  label: 'Spending',
                  data: scope.chartData,
                  backgroundColor: 'rgba(52, 152, 219, 0.6)',
                  borderColor: 'rgba(52, 152, 219, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
          scope.$watchGroup(['chartData', 'chartLabels'], function(newVals) {
            if (newVals[0] && newVals[1]) {
              $timeout(renderChart, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();