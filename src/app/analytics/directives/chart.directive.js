(function() {
  'use strict';
  angular.module('analytics')
    .directive('chartDirective', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartOptions: '='
        },
        template: '<canvas></canvas>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chartInstance = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              chartInstance = new Chart(ctx, {
                type: scope.chartType || 'line',
                data: newData,
                options: scope.chartOptions || {}
              });
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