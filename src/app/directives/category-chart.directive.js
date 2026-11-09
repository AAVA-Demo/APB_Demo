(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="categoryChart" width="400" height="300"></canvas>',
        link: function(scope, element) {
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              var ctx = element.find('canvas')[0].getContext('2d');
              var labels = newData.map(function(item) { return item.categoryName; });
              var amounts = newData.map(function(item) { return item.amount; });
              new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: amounts,
                    backgroundColor: [
                      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                    ]
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