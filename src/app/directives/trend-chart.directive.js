(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartType: '@',
          chartData: '=',
          chartTitle: '@'
        },
        template: '<canvas id="trendChartCanvas" width="800" height="400"></canvas>',
        link: function(scope, element) {
          let chart = null;
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          function renderChart() {
            if (!scope.chartData || scope.chartData.length === 0) return;
            let labels, data, datasets;
            if (scope.chartType === 'line') {
              labels = scope.chartData.map(function(item) { return item.month; });
              data = scope.chartData.map(function(item) { return item.totalSpend; });
              datasets = [{
                label: 'Monthly Spend',
                data: data,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4
              }];
            } else {
              labels = scope.chartData.map(function(item) { return item.cardName; });
              data = scope.chartData.map(function(item) { return item.totalSpend; });
              datasets = [{
                label: 'Card-wise Spend',
                data: data,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
                borderWidth: 1
              }];
            }
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: scope.chartType === 'line' ? 'line' : 'bar',
              data: {
                labels: labels,
                datasets: datasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                title: {
                  display: true,
                  text: scope.chartTitle
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        return '$' + value.toFixed(0);
                      }
                    }
                  }]
                },
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return '$' + tooltipItem.yLabel.toFixed(2);
                    }
                  }
                }
              }
            });
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal) {
              setTimeout(renderChart, 100);
            }
          }, true);
        }
      };
    }]);
})();