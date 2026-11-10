(function() {
  'use strict';
  angular.module('analytics')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div class="chart-container"><canvas id="trendChart"></canvas></div>',
        link: function(scope, element) {
          var chartInstance = null;
          scope.$watch('data', function(newData) {
            if (!newData || !newData.monthlyTrends) return;
            var ctx = element.find('canvas')[0].getContext('2d');
            var labels = newData.monthlyTrends.map(function(item) { return item.month; });
            var amounts = newData.monthlyTrends.map(function(item) { return item.totalSpend; });
            if (chartInstance) {
              chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: amounts,
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  yAxes: [{
                    ticks: { beginAtZero: true }
                  }]
                },
                title: { display: true, text: 'Monthly Spending Trend' }
              }
            });
          }, true);
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();