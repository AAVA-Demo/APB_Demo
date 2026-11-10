(function() {
  'use strict';
  angular.module('creditCard.analyticsModule')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<div class="chart-container"><canvas id="{{chartId}}"></canvas></div>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          function renderChart() {
            if (!scope.chartData || !scope.chartData.labels) return;
            $timeout(function() {
              var ctx = document.getElementById(scope.chartId);
              if (!ctx) return;
              if (chart) {
                chart.destroy();
              }
              var config = {
                type: scope.chartType || 'pie',
                data: {
                  labels: scope.chartData.labels,
                  datasets: [{
                    data: scope.chartData.data,
                    backgroundColor: [
                      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                    ]
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: {
                    position: 'bottom'
                  }
                }
              };
              chart = new Chart(ctx, config);
            }, 100);
          }
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