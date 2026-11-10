(function() {
  'use strict';
  angular.module('creditCard.analytics').directive('spendingChart', function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas id="{{canvasId}}" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.canvasId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (!newData || newData.length === 0) return;
          var ctx = document.getElementById(scope.canvasId);
          if (!ctx) return;
          if (chart) {
            chart.destroy();
          }
          var chartConfig = {};
          if (scope.chartType === 'pie') {
            chartConfig = {
              type: 'pie',
              data: {
                labels: newData.map(function(d) { return d.category; }),
                datasets: [{
                  data: newData.map(function(d) { return d.totalAmount; }),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            };
          } else if (scope.chartType === 'line') {
            chartConfig = {
              type: 'line',
              data: {
                labels: newData.map(function(d) { return d.month; }),
                datasets: [{
                  label: 'Monthly Spend',
                  data: newData.map(function(d) { return d.totalSpend; }),
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
          } else if (scope.chartType === 'bar') {
            chartConfig = {
              type: 'bar',
              data: {
                labels: newData.map(function(d) { return d.cardName; }),
                datasets: [{
                  label: 'Card-wise Spend',
                  data: newData.map(function(d) { return d.totalSpend; }),
                  backgroundColor: '#4BC0C0'
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
        });
      }
    };
  });
})();