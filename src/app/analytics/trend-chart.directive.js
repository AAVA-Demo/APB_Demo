(function() {
  'use strict';
  angular.module('analyticsModule').directive('trendChart', trendChart);
  function trendChart() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="chart-container"><h4>Monthly Spend Trends</h4><canvas id="trendChart" class="chart chart-line" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.chartLabels = newData.map(function(m) { return m.month; });
            scope.chartSeries = ['Total Spend'];
            scope.chartData = [newData.map(function(m) { return m.totalSpend; })];
            scope.chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: { beginAtZero: true }
                }]
              }
            };
          }
        });
      }
    };
  }
})();