(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartConfig: '='
        },
        template: '<canvas id="categoryChart" width="400" height="300"></canvas>',
        link: function(scope, element) {
          var chart = null;
          scope.$watch('chartConfig', function(config) {
            if (config && scope.chartData && scope.chartData.length > 0) {
              var ctx = element.find('canvas')[0].getContext('2d');
              if (chart) chart.destroy();
              chart = new Chart(ctx, config);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();