(function() {
  'use strict';
  angular.module('analytics')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          monthlyTrends: '='
        },
        template: '<div class="chart-container"><h4>Monthly Spend Trend</h4><canvas id="trendChart"></canvas></div>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          var chartInstance = null;
          scope.$watch('monthlyTrends', function(trends) {
            if (trends && trends.length > 0) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              var labels = trends.map(function(t) { return t.month; });
              var data = trends.map(function(t) { return t.totalSpend; });
              chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Monthly Spend',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true }
                  },
                  scales: {
                    y: { beginAtZero: true }
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