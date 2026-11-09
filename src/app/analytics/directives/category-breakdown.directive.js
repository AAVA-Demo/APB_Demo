(function() {
  'use strict';
  angular.module('app.analytics').directive('categoryBreakdown', function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="category-breakdown"><canvas id="categoryChartCanvas" width="400" height="200"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var ctx = element.find('canvas')[0].getContext('2d');
            var labels = newData.map(function(item) { return item.category; });
            var values = newData.map(function(item) { return parseFloat(item.amount); });
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true
              }
            });
          }
        });
      }
    };
  });
})();