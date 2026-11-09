(function() {
  'use strict';
  angular.module('app.analytics').directive('spendingChart', spendingChart);
  function spendingChart() {
    return {
      restrict: 'E',
      scope: {
        chartType: '=',
        chartData: '='
      },
      template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
      link: function(scope, element) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            renderChart(newData);
          }
        });
        function renderChart(data) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }
          if (scope.chartType === 'pie') {
            chart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: data.map(function(item) { return item.categoryName; }),
                datasets: [{
                  data: data.map(function(item) { return item.totalSpend; }),
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                  ]
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' }
              }
            });
          } else if (scope.chartType === 'line') {
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: data.map(function(item) { return item.month; }),
                datasets: [{
                  label: 'Monthly Spend',
                  data: data.map(function(item) { return item.totalSpend; }),
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
                    ticks: { beginAtZero: true }
                  }]
                }
              }
            });
          }
        }
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }
})();