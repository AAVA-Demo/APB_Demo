(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('chartDirective', ['$window', chartDirective]);
  function chartDirective($window) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '='
      },
      template: '<canvas id="analyticsChart" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        var canvas = element.find('canvas')[0];
        var ctx = canvas.getContext('2d');
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            renderChart(newData, scope.chartType);
          }
        }, true);
        function renderChart(data, type) {
          if (chart) {
            chart.destroy();
          }
          var chartConfig = {};
          if (type === 'pie') {
            chartConfig = {
              type: 'pie',
              data: {
                labels: data.map(function(d) { return d.category; }),
                datasets: [{
                  data: data.map(function(d) { return d.totalAmount; }),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            };
          } else if (type === 'line') {
            chartConfig = {
              type: 'line',
              data: {
                labels: data.map(function(d) { return d.month; }),
                datasets: [{
                  label: 'Monthly Spend',
                  data: data.map(function(d) { return d.totalSpend; }),
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
          }
          chart = new Chart(ctx, chartConfig);
        }
      }
    };
  }
})();