(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        scope: {
          chartType: '@',
          chartData: '=',
          chartId: '@'
        },
        link: function(scope, element, attrs) {
          var chart = null;
          var canvas = document.createElement('canvas');
          canvas.id = scope.chartId;
          element.append(canvas);
          scope.$watch('chartData', function(newData) {
            if (newData) {
              $timeout(function() {
                renderChart(newData);
              }, 100);
            }
          });
          function renderChart(data) {
            if (chart) {
              chart.destroy();
            }
            var ctx = canvas.getContext('2d');
            var chartConfig = {};
            if (scope.chartType === 'pie') {
              chartConfig = {
                type: 'pie',
                data: {
                  labels: data.map(function(d) { return d.name; }),
                  datasets: [{
                    data: data.map(function(d) { return d.amount; }),
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6']
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  legend: { position: 'bottom' }
                }
              };
            } else if (scope.chartType === 'line') {
              chartConfig = {
                type: 'line',
                data: {
                  labels: data.map(function(d) { return d.month; }),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: data.map(function(d) { return d.amount; }),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    yAxes: [{
                      ticks: { beginAtZero: true }
                    }]
                  }
                }
              };
            }
            chart = new Chart(ctx, chartConfig);
          }
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();