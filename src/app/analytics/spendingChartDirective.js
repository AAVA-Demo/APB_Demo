(function() {
  'use strict';
  angular.module('creditCardApp').directive('spendingChart', function() {
    return {
      restrict: 'E',
      scope: {
        categories: '='
      },
      template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
      link: function(scope, element) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('categories', function(newCategories) {
          if (newCategories && newCategories.length > 0) {
            var labels = newCategories.map(function(cat) { return cat.category; });
            var data = newCategories.map(function(cat) { return cat.totalAmount; });
            var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: data,
                  backgroundColor: colors
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' }
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