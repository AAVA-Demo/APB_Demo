(function() {
  'use strict';
  angular.module('creditCardApp').directive('chartDirective', [function() {
    return {
      restrict: 'E',
      scope: {
        chartType: '=',
        chartData: '=',
        chartLabel: '='
      },
      template: '<canvas id="myChart" style="max-height: 400px;"></canvas>',
      link: function(scope, element, attrs) {
        let chart = null;
        
        function renderChart() {
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          
          if (chart) {
            chart.destroy();
          }
          
          if (scope.chartType === 'line' && scope.chartData) {
            const labels = scope.chartData.map(d => d.month);
            const data = scope.chartData.map(d => d.totalSpend);
            
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: scope.chartLabel || 'Spending',
                  data: data,
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  tension: 0.4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true },
                  tooltip: { enabled: true }
                }
              }
            });
          } else if (scope.chartType === 'pie' && scope.chartData) {
            const labels = scope.chartData.map(d => d.categoryName);
            const data = scope.chartData.map(d => d.totalAmount);
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
            
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
                plugins: {
                  legend: { position: 'right' },
                  tooltip: { enabled: true }
                }
              }
            });
          }
        }
        
        scope.$watch('chartData', function(newVal) {
          if (newVal) {
            renderChart();
          }
        }, true);
        
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
})();