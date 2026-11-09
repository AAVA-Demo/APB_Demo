(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartType: '@',
          chartData: '=',
          chartLabels: '@',
          chartValues: '@'
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chartInstance = null;
          scope.$watch('chartData', function(newData) {
            if (newData && newData.length > 0) {
              var canvas = element.find('canvas')[0];
              var ctx = canvas.getContext('2d');
              if (chartInstance) {
                chartInstance.destroy();
              }
              var labels = newData.map(function(item) {
                return item[scope.chartLabels];
              });
              var data = newData.map(function(item) {
                return item[scope.chartValues];
              });
              var config = {
                type: scope.chartType,
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Amount ($)',
                    data: data,
                    backgroundColor: scope.chartType === 'pie' ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'] : 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false
                }
              };
              chartInstance = new Chart(ctx, config);
            }
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