(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '=',
          chartId: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (!newData) return;
            $timeout(function() {
              if (chart) {
                chart.destroy();
              }
              var ctx = document.getElementById(scope.chartId);
              if (!ctx) return;
              var config = buildChartConfig(newData, scope.chartType);
              chart = new Chart(ctx, config);
            }, 100);
          }, true);
          function buildChartConfig(data, type) {
            if (type === 'pie') {
              var labels = Object.keys(data);
              var values = Object.values(data);
              return {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: values,
                    backgroundColor: generateColors(labels.length)
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false
                }
              };
            } else if (type === 'line') {
              var labels = data.map(function(d) { return d.month; });
              var values = data.map(function(d) { return d.spend; });
              return {
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
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              };
            } else if (type === 'bar') {
              var labels = Object.keys(data);
              var values = Object.values(data);
              return {
                type: 'bar',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Card-Wise Spend',
                    data: values,
                    backgroundColor: generateColors(labels.length)
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              };
            }
          }
          function generateColors(count) {
            var colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
            var result = [];
            for (var i = 0; i < count; i++) {
              result.push(colors[i % colors.length]);
            }
            return result;
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