(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="trendChart" width="400" height="300"></canvas>',
        link: function(scope, element) {
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              var ctx = element.find('canvas')[0].getContext('2d');
              var labels = newData.map(function(item) { return item.month; });
              var amounts = newData.map(function(item) { return item.amount; });
              new Chart(ctx, {
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
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              });
            }
          });
        }
      };
    }]);
})();