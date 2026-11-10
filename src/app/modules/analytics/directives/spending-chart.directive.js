(function() {
  'use strict';
  angular.module('analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div class="chart-container"><canvas id="spendingChart"></canvas></div>',
        link: function(scope, element) {
          var chartInstance = null;
          scope.$watch('data', function(newData) {
            if (!newData || !newData.categorySpending) return;
            var ctx = element.find('canvas')[0].getContext('2d');
            var labels = newData.categorySpending.map(function(item) { return item.category; });
            var amounts = newData.categorySpending.map(function(item) { return item.amount; });
            if (chartInstance) {
              chartInstance.destroy();
            }
            chartInstance = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: amounts,
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { position: 'bottom' },
                title: { display: true, text: 'Category-Wise Spending' }
              }
            });
          }, true);
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();