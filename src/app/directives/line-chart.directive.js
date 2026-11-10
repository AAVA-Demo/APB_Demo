(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('lineChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          labels: '='
        },
        template: '<canvas id="lineChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart = null;
          scope.$watchGroup(['data', 'labels'], function(newVals) {
            if (newVals[0] && newVals[1]) {
              const ctx = element.find('canvas')[0].getContext('2d');
              if (chart) chart.destroy();
              chart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: scope.labels,
                  datasets: [{
                    label: 'Monthly Spend',
                    data: scope.data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0,123,255,0.1)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
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