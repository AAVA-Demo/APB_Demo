(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartDirective', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartLabels: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              $timeout(function() {
                var ctx = document.getElementById(scope.chartId);
                if (ctx) {
                  if (chart) {
                    chart.destroy();
                  }
                  var config = {
                    type: scope.chartType || 'pie',
                    data: {
                      labels: scope.chartLabels || [],
                      datasets: [{
                        data: newData,
                        backgroundColor: [
                          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                        ]
                      }]
                    },
                    options: {
                      responsive: true,
                      maintainAspectRatio: false
                    }
                  };
                  chart = new Chart(ctx, config);
                }
              }, 100);
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