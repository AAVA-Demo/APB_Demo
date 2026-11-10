(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryChart', categoryChart);
  function categoryChart() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="chart-container"><h4>Category-wise Spending</h4><canvas id="categoryChart" class="chart chart-pie" chart-data="chartData" chart-labels="chartLabels" chart-options="chartOptions"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.chartLabels = newData.map(function(c) { return c.category; });
            scope.chartData = newData.map(function(c) { return c.amount; });
            scope.chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              legend: { display: true, position: 'right' }
            };
          }
        });
      }
    };
  }
})();