(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartVisualization', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<canvas id="chart-{{$id}}" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          let chart = null;
          function renderChart() {
            if (!scope.chartData || scope.chartData.length === 0) return;
            const canvas = element.find('canvas')[0];
            const ctx = canvas.getContext('2d');
            if (chart) chart.destroy();
            const labels = scope.chartData.map(d => d.category);
            const data = scope.chartData.map(d => d.totalAmount);
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
            const config = {
              type: scope.chartType || 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: data,
                  backgroundColor: colors,
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: true, position: 'bottom' }
              }
            };
            chart = new Chart(ctx, config);
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal) renderChart();
          }, true);
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();