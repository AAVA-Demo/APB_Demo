(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartCanvas', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartOptions: '='
        },
        template: '<canvas></canvas>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var chart = null;
          function renderChart() {
            if (chart) {
              chart.destroy();
            }
            if (!scope.chartData) {
              return;
            }
            var ctx = canvas.getContext('2d');
            var options = scope.chartOptions || {
              responsive: true,
              maintainAspectRatio: true,
              legend: { display: true, position: 'bottom' }
            };
            chart = new Chart(ctx, {
              type: scope.chartType || 'pie',
              data: scope.chartData,
              options: options
            });
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal) {
              $timeout(function() {
                renderChart();
              }, 100);
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