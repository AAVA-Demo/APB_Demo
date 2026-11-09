(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('categoryChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          onCategoryClick: '='
        },
        template: '<canvas id="categoryChartCanvas" width="400" height="400"></canvas>',
        link: function(scope, element) {
          let chart = null;
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          function renderChart() {
            if (!scope.chartData || scope.chartData.length === 0) return;
            const labels = scope.chartData.map(function(item) { return item.category; });
            const data = scope.chartData.map(function(item) { return item.totalSpend; });
            const backgroundColors = [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
            ];
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: labels,
                datasets: [{
                  data: data,
                  backgroundColor: backgroundColors,
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                  position: 'bottom'
                },
                onClick: function(event, items) {
                  if (items.length > 0 && scope.onCategoryClick) {
                    const index = items[0]._index;
                    const category = labels[index];
                    scope.onCategoryClick(category);
                    scope.$apply();
                  }
                }
              }
            });
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal) {
              setTimeout(renderChart, 100);
            }
          }, true);
        }
      };
    }]);
})();