(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@',
          chartTitle: '@'
        },
        template: '<div><h4>{{chartTitle}}</h4><canvas id="{{canvasId}}"></canvas></div>',
        link: function(scope, element, attrs) {
          scope.canvasId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          function renderChart() {
            if (!scope.chartData || scope.chartData.length === 0) return;
            var canvas = element.find('canvas')[0];
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            if (chart) {
              chart.destroy();
            }
            if (scope.chartType === 'pie') {
              var labels = scope.chartData.map(function(d) { return d.category; });
              var data = scope.chartData.map(function(d) { return d.totalAmount; });
              var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
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
                  maintainAspectRatio: true
                }
              });
            } else if (scope.chartType === 'line' || scope.chartType === 'bar') {
              var labels = scope.chartData.map(function(d) { return d.month; });
              var data = scope.chartData.map(function(d) { return d.totalSpend; });
              chart = new Chart(ctx, {
                type: scope.chartType,
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Total Spend',
                    data: data,
                    backgroundColor: scope.chartType === 'bar' ? '#36A2EB' : 'rgba(54, 162, 235, 0.2)',
                    borderColor: '#36A2EB',
                    borderWidth: 2,
                    fill: scope.chartType === 'line'
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              });
            }
          }
          scope.$watch('chartData', function(newVal, oldVal) {
            if (newVal) {
              setTimeout(renderChart, 100);
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