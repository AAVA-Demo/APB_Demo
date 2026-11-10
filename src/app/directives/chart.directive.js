(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartDirective', [function() {
      return {
        restrict: 'A',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        link: function(scope, element, attrs) {
          var chart = null;
          var ctx = element[0].getContext('2d');
          function renderChart() {
            if (!scope.chartData || !scope.chartData.labels || !scope.chartData.data) {
              return;
            }
            if (chart) {
              chart.destroy();
            }
            var config = {
              type: scope.chartType || 'bar',
              data: {
                labels: scope.chartData.labels,
                datasets: [{
                  label: 'Amount ($)',
                  data: scope.chartData.data,
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
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { display: scope.chartType === 'pie' },
                scales: scope.chartType !== 'pie' ? {
                  yAxes: [{ ticks: { beginAtZero: true } }]
                } : {}
              }
            };
            chart = new Chart(ctx, config);
          }
          scope.$watch('chartData', function(newVal, oldVal) {
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