(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('spendingChart', [spendingChart]);

  function spendingChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '<',
        chartType: '@'
      },
      template: '<div class="chart-container"><canvas id="spendingChart"></canvas></div>',
      link: function(scope, element, attrs) {
        var chart = null;
        var canvas = element.find('canvas')[0];
        var ctx = canvas.getContext('2d');

        scope.$watch('chartData', function(newData) {
          if (newData) {
            renderChart(newData, scope.chartType);
          }
        });

        scope.$watch('chartType', function(newType) {
          if (scope.chartData) {
            renderChart(scope.chartData, newType);
          }
        });

        function renderChart(data, type) {
          if (chart) {
            chart.destroy();
          }

          chart = new Chart(ctx, {
            type: type || 'line',
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: type === 'pie' ? {} : {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                      return '$' + value.toFixed(2);
                    }
                  }
                }]
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += '$' + tooltipItem.yValue.toFixed(2);
                    return label;
                  }
                }
              }
            }
          });
        }

        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }
})();