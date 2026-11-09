(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('trendChart', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        scope: {
          data: '='
        },
        template: '<canvas id="trendChart" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                var ctx = element.find('canvas')[0].getContext('2d');
                if (chart) {
                  chart.destroy();
                }
                var labels = newData.map(function(item) { return item.month; });
                var amounts = newData.map(function(item) { return item.totalSpend; });
                chart = new Chart(ctx, {
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
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true,
                          callback: function(value) {
                            return '$' + value.toFixed(2);
                          }
                        }
                      }]
                    }
                  }
                });
              }, 0);
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