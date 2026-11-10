(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          onDrillDown: '&'
        },
        template: '<div class="chart-container"><canvas id="{{chartId}}"></canvas></div>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var ctx = null;
          var chart = null;

          scope.$watch('chartData', function(newData) {
            if (newData && newData.labels && newData.data) {
              scope.renderChart();
            }
          }, true);

          scope.renderChart = function() {
            if (chart) {
              chart.destroy();
            }
            ctx = document.getElementById(scope.chartId);
            if (!ctx) return;

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
                maintainAspectRatio: false,
                onClick: function(evt, item) {
                  if (item.length > 0) {
                    var index = item[0]._index;
                    var category = scope.chartData.labels[index];
                    scope.$apply(function() {
                      scope.onDrillDown({category: category});
                    });
                  }
                }
              }
            };

            if (scope.chartType === 'line') {
              config.options.scales = {
                yAxes: [{ ticks: { beginAtZero: true } }]
              };
            }

            chart = new Chart(ctx, config);
          };

          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    });
})();