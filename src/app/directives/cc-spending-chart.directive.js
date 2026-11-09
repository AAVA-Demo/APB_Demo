(function() {
  'use strict';
  angular.module('cc.analytics')
    .directive('ccSpendingChart', ['$timeout', ccSpendingChart]);
  function ccSpendingChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartType: '@',
        chartData: '=',
        selectedCategory: '='
      },
      templateUrl: 'src/app/directives/templates/spending-chart.html',
      link: function(scope, element) {
        var chartInstance = null;
        scope.$watch('chartData', function(newData) {
          if (newData) {
            $timeout(function() {
              renderChart(newData, scope.chartType);
            }, 100);
          }
        });
        function renderChart(data, type) {
          var canvas = element.find('canvas')[0];
          if (!canvas) return;
          var ctx = canvas.getContext('2d');
          if (chartInstance) {
            chartInstance.destroy();
          }
          var chartConfig = buildChartConfig(data, type);
          chartInstance = new Chart(ctx, chartConfig);
        }
        function buildChartConfig(data, type) {
          if (type === 'line') {
            return {
              type: 'line',
              data: {
                labels: data.map(function(d) { return d.month + ' ' + d.year; }),
                datasets: [{
                  label: 'Monthly Spend',
                  data: data.map(function(d) { return d.totalSpend; }),
                  borderColor: '#007bff',
                  backgroundColor: 'rgba(0,123,255,0.1)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: { mode: 'index', intersect: false },
                scales: {
                  yAxes: [{ ticks: { beginAtZero: true } }]
                }
              }
            };
          } else if (type === 'pie') {
            return {
              type: 'pie',
              data: {
                labels: data.map(function(d) { return d.category; }),
                datasets: [{
                  data: data.map(function(d) { return d.totalAmount; }),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var label = data.labels[tooltipItem.index];
                      var value = data.datasets[0].data[tooltipItem.index];
                      return label + ': $' + value.toFixed(2);
                    }
                  }
                }
              }
            };
          }
        }
        scope.$on('$destroy', function() {
          if (chartInstance) {
            chartInstance.destroy();
          }
        });
      }
    };
  }
})();