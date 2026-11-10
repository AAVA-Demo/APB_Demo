(function() {
  'use strict';
  angular.module('analyticsModule').directive('cardWiseChart', cardWiseChart);
  function cardWiseChart() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="chart-container"><h4>Card-wise Spend Analysis</h4><canvas id="cardWiseChart" class="chart chart-bar" chart-data="chartData" chart-labels="chartLabels" chart-series="chartSeries" chart-options="chartOptions"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.chartLabels = newData.map(function(c) { return c.cardName; });
            scope.chartSeries = ['Total Spend'];
            scope.chartData = [newData.map(function(c) { return c.totalSpend; })];
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