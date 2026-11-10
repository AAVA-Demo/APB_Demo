(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          type: '@'
        },
        template: '<canvas id="{{chartId}}" class="chart"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          let chart = null;
          scope.$watch('data', function(newData) {
            if (!newData) return;
            const canvas = element.find('canvas')[0];
            const ctx = canvas.getContext('2d');
            if (chart) {
              chart.destroy();
            }
            const chartType = scope.type || 'bar';
            const labels = newData.map(d => d.label || d.category || d.month);
            const values = newData.map(d => d.value || d.totalAmount || d.totalSpend);
            chart = new Chart(ctx, {
              type: chartType,
              data: {
                labels: labels,
                datasets: [{
                  label: 'Spending',
                  data: values,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: chartType !== 'pie' ? {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        return '$' + value.toFixed(0);
                      }
                    }
                  }]
                } : {},
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                      return '$' + value.toFixed(2);
                    }
                  }
                }
              }
            });
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();