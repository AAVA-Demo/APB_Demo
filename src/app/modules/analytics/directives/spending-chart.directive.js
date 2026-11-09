(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', ['VisualizationFactory', '$timeout', function(VisualizationFactory, $timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          chartType: '@',
          onCategoryClick: '&'
        },
        template: '<canvas id="{{ chartId }}" width="400" height="200"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
          var chartInstance = null;
          scope.$watch('data', function(newData) {
            if (newData) {
              $timeout(function() {
                if (chartInstance) {
                  chartInstance.destroy();
                }
                var canvas = document.getElementById(scope.chartId);
                if (canvas) {
                  var ctx = canvas.getContext('2d');
                  if (scope.chartType === 'pie') {
                    chartInstance = VisualizationFactory.createPieChart(ctx, newData, scope.onCategoryClick);
                  } else if (scope.chartType === 'line') {
                    chartInstance = VisualizationFactory.createLineChart(ctx, newData);
                  } else if (scope.chartType === 'bar') {
                    chartInstance = VisualizationFactory.createBarChart(ctx, newData);
                  }
                }
              }, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();