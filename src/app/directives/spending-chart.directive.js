(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<canvas id="chart-{{chartId}}" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = Math.random().toString(36).substring(7);
          var chart = null;
          function renderChart() {
            if (!scope.chartData) return;
            $timeout(function() {
              var canvas = element.find('canvas')[0];
              if (!canvas) return;
              var ctx = canvas.getContext('2d');
              if (chart) {
                chart.destroy();
              }
              var labels = [];
              var data = [];
              if (scope.chartType === 'pie') {
                labels = Object.keys(scope.chartData);
                data = labels.map(function(key) { return scope.chartData[key]; });
                chart = new Chart(ctx, {
                  type: 'pie',
                  data: {
                    labels: labels,
                    datasets: [{
                      data: data,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false
                  }
                });
              } else if (scope.chartType === 'line') {
                labels = scope.chartData.map(function(item) { return item.month; });
                data = scope.chartData.map(function(item) { return item.totalSpend; });
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: data,
                      borderColor: '#36A2EB',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    }
                  }
                });
              }
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