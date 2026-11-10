(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('monthlyTrendChart', function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '='
        },
        template: '<canvas id="monthlyTrendChart"></canvas>',
        link: function(scope, element) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'line',
                data: newData,
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
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