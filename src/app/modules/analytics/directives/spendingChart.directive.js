(function() {
  'use strict';
  angular.module('analytics.module')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<div class="chart-container"><canvas id="{{canvasId}}"></canvas></div>',
        link: function(scope, element, attrs) {
          scope.canvasId = 'chart_' + Math.random().toString(36).substring(7);
          let chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              scope.renderChart(newData);
            }
          });
          scope.$on('spendingDataUpdated', function(event, data) {
            if (scope.chartType === 'category') {
              scope.renderChart(data);
            }
          });
          scope.$on('trendDataUpdated', function(event, data) {
            if (scope.chartType === 'trend') {
              scope.renderChart(data);
            }
          });
          scope.renderChart = function(data) {
            setTimeout(function() {
              const canvas = document.getElementById(scope.canvasId);
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              if (chart) {
                chart.destroy();
              }
              if (scope.chartType === 'category' && data.categories) {
                chart = new Chart(ctx, {
                  type: 'bar',
                  data: {
                    labels: data.categories.map(function(c) { return c.name; }),
                    datasets: [{
                      label: 'Spending by Category',
                      data: data.categories.map(function(c) { return c.amount; }),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }
                });
              } else if (scope.chartType === 'trend' && data.months) {
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: data.months,
                    datasets: [{
                      label: 'Monthly Spending Trend',
                      data: data.spending,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }
                });
              }
            }, 100);
          };
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();