(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', spendingChart);
  spendingChart.$inject = ['$timeout'];
  function spendingChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<canvas id="spending-chart-{{$id}}" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData) {
            $timeout(function() {
              renderChart(newData);
            });
          }
        });
        function renderChart(data) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }
          var chartType = scope.type || 'pie';
          chart = new Chart(ctx, {
            type: chartType,
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          });
        }
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }
})();