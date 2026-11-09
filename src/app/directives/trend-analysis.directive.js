(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('trendAnalysis', ['DataVisualizationService', '$timeout', function(DataVisualizationService, $timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div class="chart-container"><h4>Monthly Spend Trend</h4><canvas id="trendChart" width="400" height="300"></canvas></div>',
        link: function(scope, element) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                if (chart) DataVisualizationService.destroyChart(chart);
                var labels = newData.map(function(d) { return d.month; });
                var values = newData.map(function(d) { return d.totalSpend; });
                chart = DataVisualizationService.renderChart('trendChart', 'line', {
                  labels: labels,
                  datasets: [{
                    label: 'Monthly Spend',
                    data: values,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4
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