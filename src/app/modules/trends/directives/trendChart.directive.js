(function() {
  'use strict';
  angular.module('creditCard.trends')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div><canvas id="trendChart"></canvas></div>',
        link: function(scope, element, attrs) {
          let chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              const canvas = element.find('canvas')[0];
              const ctx = canvas.getContext('2d');
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: newData.map(function(d) { return d.month; }),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: newData.map(function(d) { return d.totalSpend; }),
                    borderColor: '#36A2EB',
                    fill: false
                  }]
                },
                options: {
                  responsive: true,
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
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();