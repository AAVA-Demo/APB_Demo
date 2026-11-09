(function() {
  'use strict';
  angular.module('creditCard.analytics').directive('ccSpendingChart', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartType: '@',
        chartData: '=',
        chartTitle: '@'
      },
      template: '<div><canvas id="{{canvasId}}" width="400" height="300"></canvas></div>',
      link: function(scope, element) {
        scope.canvasId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        function renderChart() {
          if (!scope.chartData || scope.chartData.length === 0) return;
          var ctx = document.getElementById(scope.canvasId);
          if (!ctx) return;
          var config = {};
          if (scope.chartType === 'pie') {
            config = {
              type: 'pie',
              data: {
                labels: scope.chartData.map(function(d) { return d.categoryName; }),
                datasets: [{
                  data: scope.chartData.map(function(d) { return d.totalAmount; }),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {display: true, text: scope.chartTitle}
              }
            };
          } else if (scope.chartType === 'line') {
            config = {
              type: 'line',
              data: {
                labels: scope.chartData.map(function(d) { return d.month; }),
                datasets: [{
                  label: 'Total Spend',
                  data: scope.chartData.map(function(d) { return d.totalSpend; }),
                  borderColor: '#36A2EB',
                  fill: false
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {display: true, text: scope.chartTitle},
                scales: {
                  yAxes: [{ticks: {beginAtZero: true}}]
                }
              }
            };
          } else if (scope.chartType === 'bar') {
            config = {
              type: 'bar',
              data: {
                labels: scope.chartData.map(function(d) { return d.cardName; }),
                datasets: [{
                  label: 'Total Spend',
                  data: scope.chartData.map(function(d) { return d.totalSpend; }),
                  backgroundColor: '#36A2EB'
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {display: true, text: scope.chartTitle},
                scales: {
                  yAxes: [{ticks: {beginAtZero: true}}]
                }
              }
            };
          }
          if (chart) chart.destroy();
          chart = new Chart(ctx, config);
        }
        scope.$watch('chartData', function(newVal) {
          if (newVal) {
            $timeout(renderChart, 100);
          }
        });
      }
    };
  }]);
})();