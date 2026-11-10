(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartDirective', function() {
      return {
        restrict: 'E',
        scope: {
          chartType: '@',
          chartData: '=',
          chartOptions: '='
        },
        template: '<canvas id="chart-{{$id}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chartInstance = null;
          scope.$watch('chartData', function(newData) {
            if (newData && newData.labels && newData.data) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              var chartConfig = {
                type: scope.chartType || 'bar',
                data: {
                  labels: newData.labels,
                  datasets: [{
                    label: 'Spending',
                    data: newData.data,
                    backgroundColor: scope.chartType === 'pie' ? [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)',
                      'rgba(153, 102, 255, 0.7)',
                      'rgba(255, 159, 64, 0.7)',
                      'rgba(199, 199, 199, 0.7)',
                      'rgba(83, 102, 255, 0.7)',
                      'rgba(255, 99, 255, 0.7)'
                    ] : 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  }]
                },
                options: scope.chartOptions || {
                  responsive: true,
                  maintainAspectRatio: false
                }
              };
              chartInstance = new Chart(ctx, chartConfig);
            }
          }, true);
          scope.$on('$destroy', function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
          });
        }
      };
    });
})();