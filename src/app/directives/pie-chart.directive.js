(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('pieChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          labels: '='
        },
        template: '<canvas id="pieChart" width="400" height="400"></canvas>',
        link: function(scope, element) {
          let chart = null;
          scope.$watchGroup(['data', 'labels'], function(newVals) {
            if (newVals[0] && newVals[1]) {
              const ctx = element.find('canvas')[0].getContext('2d');
              if (chart) chart.destroy();
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: scope.labels,
                  datasets: [{
                    data: scope.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true
                }
              });
            }
          });
        }
      };
    }]);
})();