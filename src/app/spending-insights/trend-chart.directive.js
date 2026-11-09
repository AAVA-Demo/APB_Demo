(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .directive('trendChart', ['VisualizationFactory', function(VisualizationFactory) {
      return {
        restrict: 'E',
        scope: {
          chartData: '='
        },
        template: '<canvas id="trend-chart-{{$id}}" width="400" height="250"></canvas>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          scope.$watch('chartData', function(newData) {
            if (newData && newData.length > 0) {
              var config = VisualizationFactory.getLineChartConfig(newData);
              new Chart(ctx, config);
            }
          });
        }
      };
    }]);
})();