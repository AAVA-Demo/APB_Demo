(function() {
  'use strict';
  angular.module('creditCardApp').directive('spendingChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
      link: function(scope, element) {
        scope.$watch('data', function(newData) {
          if (newData) {
            const ctx = element.find('canvas')[0].getContext('2d');
            const labels = Object.keys(newData);
            const values = Object.values(newData);
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#C9CBCF','#4D5360','#FDB45C']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
        });
      }
    };
  }]);
})();