(function() {
  'use strict';
  angular.module('analytics')
    .directive('chartCanvas', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartType: '@',
          chartData: '=',
          chartOptions: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              $timeout(function() {
                var ctx = document.getElementById(scope.chartId);
                if (ctx) {
                  if (chart) chart.destroy();
                  chart = new Chart(ctx.getContext('2d'), {
                    type: scope.chartType,
                    data: newData,
                    options: scope.chartOptions || {responsive: true, maintainAspectRatio: true}
                  });
                }
              }, 100);
            }
          }, true);
        }
      };
    }]);