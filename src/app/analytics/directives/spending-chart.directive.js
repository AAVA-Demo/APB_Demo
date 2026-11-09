(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('spendingChart', ['$timeout', 'ChartConfigFactory', function($timeout, ChartConfigFactory) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          onChartClick: '&'
        },
        template: '<div class="spending-chart-container">' +
                  '  <canvas id="{{chartId}}" class="chart"></canvas>' +
                  '</div>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart;
          function renderChart() {
            $timeout(function() {
              var canvas = element.find('canvas')[0];
              if (!canvas) return;
              var ctx = canvas.getContext('2d');
              var config;
              if (scope.chartType === 'category') {
                config = ChartConfigFactory.getCategoryPieConfig(scope.chartData);
              } else if (scope.chartType === 'monthly') {
                config = ChartConfigFactory.getMonthlyTrendConfig(scope.chartData);
              }
              if (chart) {
                chart.destroy();
              }
              if (config) {
                chart = new Chart(ctx, config);
                canvas.onclick = function(evt) {
                  var activePoints = chart.getElementsAtEvent(evt);
                  if (activePoints.length > 0) {
                    var clickedIndex = activePoints[0]._index;
                    scope.onChartClick({ data: scope.chartData[clickedIndex] });
                    scope.$apply();
                  }
                };
              }
            }, 100);
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal && newVal.length > 0) {
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