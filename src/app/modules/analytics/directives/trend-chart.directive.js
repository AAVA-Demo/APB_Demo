(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('trendChartDirective', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="trendChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                var ctx = element.find('canvas')[0].getContext('2d');
                var labels = newData.map(function(item) { return item.month; });
                var values = newData.map(function(item) { return item.totalSpend; });
                if (chart) {
                  chart.destroy();
                }
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: values,
                      borderColor: '#36A2EB',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true,
                      tension: 0.4
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true,
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }]
                    }
                  }
                });
              }, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();