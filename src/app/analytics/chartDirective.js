(function() {
  'use strict';
  angular.module('creditCardApp').directive('categoryChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="categoryChart" class="chart chart-pie" chart-data="chartData" chart-labels="chartLabels" chart-options="chartOptions"></canvas>',
      link: function(scope) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.chartLabels = newData.map(d => d.category);
            scope.chartData = newData.map(d => d.amount);
            scope.chartOptions = {
              responsive: true,
              maintainAspectRatio: true,
              legend: {display: true, position: 'bottom'}
            };
          }
        });
      }
    };
  }]);
  angular.module('creditCardApp').directive('trendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="trendChart" class="chart chart-line" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas>',
      link: function(scope) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.chartLabels = newData.map(d => d.month);
            scope.chartData = [newData.map(d => d.totalSpend)];
            scope.chartSeries = ['Total Spend'];
            scope.chartOptions = {
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                yAxes: [{
                  ticks: {beginAtZero: true}
                }]
              }
            };
          }
        });
      }
    };
  }]);
})();