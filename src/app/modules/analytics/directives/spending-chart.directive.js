(function() {
  'use strict';
  angular.module('creditcard.analytics')
    .directive('ccSpendingChart', ['$timeout', ccSpendingChart]);
  function ccSpendingChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        scope.$watch('chartData', function(newData) {
          if (newData) {
            $timeout(function() {
              renderChart(newData, scope.chartType, scope.chartId);
            }, 100);
          }
        });
        function renderChart(data, type, chartId) {
          var ctx = document.getElementById(chartId);
          if (!ctx) return;
          var chartConfig = buildChartConfig(data, type);
          new Chart(ctx, chartConfig);
        }
        function buildChartConfig(data, type) {
          if (type === 'pie') {
            return {
              type: 'pie',
              data: {
                labels: data.map(function(d) { return d.category; }),
                datasets: [{
                  data: data.map(function(d) { return d.totalAmount; }),
                  backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            };
          } else if (type === 'line') {
            return {
              type: 'line',
              data: {
                labels: data.map(function(d) { return d.month; }),
                datasets: [{
                  label: 'Monthly Spend',
                  data: data.map(function(d) { return d.totalAmount; }),
                  borderColor: '#36A2EB',
                  fill: false
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
            };
          } else if (type === 'bar') {
            return {
              type: 'bar',
              data: {
                labels: data.map(function(d) { return d.cardName; }),
                datasets: [{
                  label: 'Card Spend',
                  data: data.map(function(d) { return d.totalSpend; }),
                  backgroundColor: '#4BC0C0'
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
            };
          }
        }
      }
    };
  }
})();