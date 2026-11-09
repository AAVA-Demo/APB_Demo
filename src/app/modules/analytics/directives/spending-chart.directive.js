(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', ['ChartConfigFactory', function(ChartConfigFactory) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartTitle: '@'
        },
        template: '<div class="chart-container">' +
                  '<h4>{{chartTitle}}</h4>' +
                  '<canvas id="{{chartId}}" class="chart" height="300"></canvas>' +
                  '</div>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          scope.$watch('chartData', function(newData) {
            if (newData && newData.data) {
              var ctx = element.find('canvas')[0].getContext('2d');
              if (scope.chartInstance) {
                scope.chartInstance.destroy();
              }
              scope.chartInstance = new Chart(ctx, newData);
            }
          });
          scope.$on('$destroy', function() {
            if (scope.chartInstance) {
              scope.chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();