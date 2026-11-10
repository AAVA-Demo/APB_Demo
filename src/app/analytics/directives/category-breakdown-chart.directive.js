(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('categoryBreakdownChart', function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '='
        },
        template: '<canvas id="categoryBreakdownChart"></canvas>',
        link: function(scope, element) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'pie',
                data: newData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false
                }
              });
            }
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    });
})();