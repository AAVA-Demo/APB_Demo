(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('categoryPieChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div><canvas id="categoryChart" width="400" height="200"></canvas></div>',
        link: function(scope, element, attrs) {
          let chart = null;
          scope.$on('analyticsDataReady', function(event, aggregated) {
            $timeout(function() {
              const ctx = document.getElementById('categoryChart');
              if (ctx) {
                const labels = aggregated.categoryBreakdown.map(function(c) { return c.category; });
                const data = aggregated.categoryBreakdown.map(function(c) { return c.amount; });
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
                if (chart) chart.destroy();
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
                    legend: {
                      position: 'right'
                    }
                  }
                });
              }
            }, 100);
          });
        }
      };
    }]);
})();