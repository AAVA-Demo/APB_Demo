(function() {
  'use strict';
  angular.module('analyticsModule').directive('spendingChart', function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
      link: function(scope, element) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var labels = newData.map(function(item) { return item.category; });
            var values = newData.map(function(item) { return item.totalSpend; });
            var colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: colors
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  position: 'bottom'
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
  });
})();