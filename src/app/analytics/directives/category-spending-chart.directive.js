(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('categorySpendingChart', ['ChartConfigFactory', function(ChartConfigFactory) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="categoryChart" width="400" height="300"></canvas>',
        link: function(scope, element) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              renderChart(newData);
            }
          }, true);
          function renderChart(data) {
            var config = ChartConfigFactory.getCategoryChartConfig(data);
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, config);
          }
        }
      };
    }]);
})();