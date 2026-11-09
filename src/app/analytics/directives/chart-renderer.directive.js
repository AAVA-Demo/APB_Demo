(function() {
  'use strict';
  angular.module('app.analytics').directive('chartRenderer', function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<div class="chart-renderer"><canvas id="chartCanvas" width="400" height="200"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('chartData', function(newData) {
          if (newData) {
            var ctx = element.find('canvas')[0].getContext('2d');
            new Chart(ctx, {
              type: scope.chartType || 'bar',
              data: newData,
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
        });
      }
    };
  });
})();