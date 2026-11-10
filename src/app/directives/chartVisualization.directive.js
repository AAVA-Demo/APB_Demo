(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartVisualization', [function() {
      return {
        restrict: 'A',
        scope: {
          chartType: '@',
          chartLabels: '=',
          chartData: '=',
          chartTitle: '@'
        },
        template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          scope.$watchGroup(['chartLabels', 'chartData'], function(newVals) {
            if (newVals[0] && newVals[1]) {
              scope.renderChart();
            }
          });
          scope.renderChart = function() {
            var canvas = element.find('canvas')[0];
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            if (scope.chart) {
              scope.chart.destroy();
            }
            var chartConfig = {
              type: scope.chartType || 'bar',
              data: {
                labels: scope.chartLabels || [],
                datasets: [{
                  label: scope.chartTitle || 'Data',
                  data: scope.chartData || [],
                  backgroundColor: scope.chartType === 'pie' ? [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                  ] : 'rgba(54, 162, 235, 0.6)',
                  borderColor: scope.chartType === 'line' ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                  display: scope.chartType === 'pie'
                },
                onClick: function(evt, item) {
                  if (item && item.length > 0) {
                    var index = item[0]._index;
                    console.log('Clicked:', scope.chartLabels[index], scope.chartData[index]);
                  }
                }
              }
            };
            scope.chart = new Chart(ctx, chartConfig);
          };
          scope.$on('$destroy', function() {
            if (scope.chart) {
              scope.chart.destroy();
            }
          });
        }
      };
    }]);
})();