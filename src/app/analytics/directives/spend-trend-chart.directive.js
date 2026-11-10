(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('spendTrendChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div><canvas id="trendChart" width="400" height="200"></canvas></div>',
        link: function(scope, element, attrs) {
          let chart = null;
          scope.$on('analyticsDataReady', function(event, aggregated) {
            $timeout(function() {
              const ctx = document.getElementById('trendChart');
              if (ctx) {
                const labels = aggregated.monthlyTrends.map(function(t) { return t.month; });
                const data = aggregated.monthlyTrends.map(function(t) { return t.totalSpend; });
                if (chart) chart.destroy();
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: data,
                      borderColor: '#337ab7',
                      backgroundColor: 'rgba(51, 122, 183, 0.1)',
                      tension: 0.4
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true,
                          callback: function(value) { return '₹' + value.toLocaleString(); }
                        }
                      }]
                    }
                  }
                });
              }
            }, 100);
          });
        }
      };
    }]);
})();