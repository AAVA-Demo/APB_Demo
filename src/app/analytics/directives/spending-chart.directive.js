(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', ['$window', function($window) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
          let chartInstance = null;
          scope.$watch('chartData', function(newData) {
            if (!newData) return;
            const canvas = element.find('canvas')[0];
            const ctx = canvas.getContext('2d');
            if (chartInstance) {
              chartInstance.destroy();
            }
            const config = {
              type: scope.chartType || 'bar',
              data: {
                labels: newData.labels,
                datasets: [{
                  label: 'Spending',
                  data: newData.data,
                  backgroundColor: newData.backgroundColor || '#36A2EB',
                  borderColor: '#2980b9',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { display: scope.chartType === 'pie' }
                }
              }
            };
            chartInstance = new Chart(ctx, config);
          });
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    }]);
})();