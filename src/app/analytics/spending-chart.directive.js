(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .directive('spendingChart', function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '='
        },
        template: '<canvas id="chart-{{$id}}" width="400" height="300"></canvas>',
        link: function(scope, element) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          scope.$watch('chartData', function(newData) {
            if (newData && newData.length > 0) {
              var labels = newData.map(function(d) { return d.category || d.month; });
              var values = newData.map(function(d) { return d.totalAmount || d.totalSpending; });
              new Chart(ctx, {
                type: scope.chartType,
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Spending',
                    data: values,
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6']
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
    });
})();