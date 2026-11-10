(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$window', function($window) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '='
        },
        template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData && newData.labels && newData.labels.length > 0) {
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: scope.chartType || 'pie',
                data: newData,
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: {
                    position: 'bottom'
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.index] || '';
                        var value = data.datasets[0].data[tooltipItem.index];
                        return label + ': $' + value.toFixed(2);
                      }
                    }
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
    }]);
})();