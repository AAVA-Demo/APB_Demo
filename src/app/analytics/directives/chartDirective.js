(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('chart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<canvas id="analyticsChart" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chartInstance = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              chartInstance = new Chart(ctx, {
                type: scope.chartType || 'pie',
                data: newData,
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: { display: true, position: 'bottom' }
                }
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