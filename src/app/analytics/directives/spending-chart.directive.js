(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          options: '=',
          chartType: '@'
        },
        template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          scope.$watch('data', function(newData) {
            if (newData) {
              renderChart();
            }
          });
          function renderChart() {
            const ctx = element.find('canvas')[0];
            if (!ctx || !scope.data) return;
            new Chart(ctx, {
              type: scope.chartType || 'bar',
              data: scope.data,
              options: scope.options || {}
            });
          }
        }
      };
    }]);
})();