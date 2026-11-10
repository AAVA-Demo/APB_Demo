(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('trendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="trendChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart = null;
          scope.$watch('data', function(newData) {
            if (!newData) return;
            const canvas = element.find('canvas')[0];
            const ctx = canvas.getContext('2d');
            if (chart) chart.destroy();
            const labels = newData.map(d => d.month);
            const values = newData.map(d => d.totalSpend);
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: values,
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                scales: {
                  yAxes: [{ ticks: { beginAtZero: true } }]
                }
              }
            });
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();