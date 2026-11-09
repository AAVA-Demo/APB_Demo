(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('spendTrendChart', function() {
      return {
        restrict: 'E',
        scope: {
          trends: '='
        },
        template: '<div><canvas id="spendTrendCanvas" width="400" height="200"></canvas></div>',
        link: function(scope, element, attrs) {
          scope.$watch('trends', function(newVal) {
            if (newVal && newVal.length > 0) {
              var ctx = element.find('canvas')[0].getContext('2d');
              var labels = newVal.map(function(t) { return t.month; });
              var data = newVal.map(function(t) { return t.amount; });
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Monthly Spend (₹)',
                    data: data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0,123,255,0.1)',
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
    });
})();