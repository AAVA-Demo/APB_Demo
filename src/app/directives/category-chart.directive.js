(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('categoryChart', ['DataVisualizationService', '$timeout', function(DataVisualizationService, $timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div class="chart-container"><h4>Category-wise Spending</h4><canvas id="categoryChart" width="400" height="300"></canvas></div>',
        link: function(scope, element) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                if (chart) DataVisualizationService.destroyChart(chart);
                var labels = newData.map(function(d) { return d.category; });
                var values = newData.map(function(d) { return d.totalSpend || d.totalAmount; });
                chart = DataVisualizationService.renderChart('categoryChart', 'bar', {
                  labels: labels,
                  datasets: [{
                    label: 'Spending by Category',
                    data: values,
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6']
                  }]
                }, { scales: { y: { beginAtZero: true } } });
              }, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) DataVisualizationService.destroyChart(chart);
          });
        }
      };
    }]);
})();