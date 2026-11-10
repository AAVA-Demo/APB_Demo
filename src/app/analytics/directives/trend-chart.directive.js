(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('trendChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="trendChart" class="chart chart-line" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas>',
        link: function(scope) {
          scope.chartLabels = [];
          scope.chartData = [[]];
          scope.chartSeries = ['Monthly Spend'];
          scope.chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }]
            }
          };
          
          scope.$watch('data', function(newData) {
            if (newData && newData.monthlyTrends) {
              $timeout(function() {
                scope.chartLabels = newData.monthlyTrends.map(function(item) {
                  return item.month;
                });
                scope.chartData = [newData.monthlyTrends.map(function(item) {
                  return item.total;
                })];
              }, 100);
            }
          }, true);
        }
      };
    }]);
})();