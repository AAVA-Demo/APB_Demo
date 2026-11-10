(function() {
  'use strict';
  angular.module('analytics')
    .directive('categoryPie', [function() {
      return {
        restrict: 'E',
        scope: {
          categoryBreakdown: '='
        },
        template: '<div class="chart-container"><h4>Category-Wise Spending</h4><canvas id="categoryChart"></canvas></div>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chartInstance = null;
          scope.$watch('categoryBreakdown', function(breakdown) {
            if (breakdown && breakdown.length > 0) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              var labels = breakdown.map(function(c) { return c.category; });
              var data = breakdown.map(function(c) { return c.totalSpend; });
              var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
              chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: data,
                    backgroundColor: colors
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }
              });
            }
          });
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();