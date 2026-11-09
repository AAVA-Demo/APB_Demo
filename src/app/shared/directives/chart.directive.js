(function() {
  'use strict';
  angular.module('creditCardApp').directive('chartDirective', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas></canvas>',
      link: function(scope, element) {
        var canvas = element.find('canvas')[0];
        var ctx = canvas.getContext('2d');
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData) {
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: scope.chartType || 'bar',
              data: newData,
              options: {responsive: true}
            });
          }
        });
      }
    };
  }]);
})();