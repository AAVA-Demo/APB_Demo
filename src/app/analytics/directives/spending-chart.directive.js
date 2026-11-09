(function() {
  'use strict';
  angular.module('app.analytics').directive('spendingChart', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<div class="spending-chart"><canvas id="spendingChartCanvas" width="400" height="200"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var ctx = element.find('canvas')[0].getContext('2d');
            var labels = newData.map(function(item) { return item.month || item.category; });
            var values = newData.map(function(item) { return parseFloat(item.amount || item.totalSpend); });
            new Chart(ctx, {
              type: scope.type || 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Spending',
                  data: values,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2
                }]
              },
              options: {
                responsive: true,
                scales: {
                  yAxes: [{
                    ticks: {beginAtZero: true}
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