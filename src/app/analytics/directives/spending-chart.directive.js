(function() {
  'use strict';
  angular.module('analyticsModule').directive('spendingChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
        let chartInstance = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            scope.renderChart(newData);
          }
        }, true);
        scope.renderChart = function(data) {
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          if (chartInstance) {
            chartInstance.destroy();
          }
          const chartConfig = scope.getChartConfig(data);
          chartInstance = new Chart(ctx, chartConfig);
        };
        scope.getChartConfig = function(data) {
          if (scope.type === 'category') {
            return {
              type: 'pie',
              data: {
                labels: data.map(d => d.category),
                datasets: [{
                  data: data.map(d => d.totalSpend),
                  backgroundColor: ['#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#1abc9c', '#34495e', '#e67e22', '#16a085', '#95a5a6']
                }]
              },
              options: {
                responsive: true,
                legend: { position: 'right' },
                title: { display: true, text: 'Category-wise Spending' }
              }
            };
          } else if (scope.type === 'monthly') {
            return {
              type: 'line',
              data: {
                labels: data.map(d => d.month),
                datasets: [{
                  label: 'Monthly Spend',
                  data: data.map(d => d.totalSpend),
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                scales: {
                  yAxes: [{ ticks: { beginAtZero: true } }]
                },
                title: { display: true, text: 'Monthly Spend Trends' }
              }
            };
          } else if (scope.type === 'card') {
            return {
              type: 'bar',
              data: {
                labels: data.map(d => d.cardId),
                datasets: [{
                  label: 'Card-wise Spend',
                  data: data.map(d => d.totalSpend),
                  backgroundColor: ['#3498db', '#e74c3c', '#2ecc71']
                }]
              },
              options: {
                responsive: true,
                scales: {
                  yAxes: [{ ticks: { beginAtZero: true } }]
                },
                title: { display: true, text: 'Card-wise Spending' }
              }
            };
          }
        };
        scope.$on('$destroy', function() {
          if (chartInstance) {
            chartInstance.destroy();
          }
        });
      }
    };
  }]);
})();