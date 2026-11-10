(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', ['$timeout', spendingChart]);
  function spendingChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData) {
            $timeout(function() {
              renderChart(newData);
            }, 100);
          }
        });
        function renderChart(data) {
          var canvas = document.getElementById(scope.chartId);
          if (!canvas) return;
          var ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }
          if (scope.type === 'category') {
            var labels = data.map(function(item) { return item.category; });
            var values = data.map(function(item) { return item.amount; });
            chart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                  ]
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' },
                tooltips: { enabled: true }
              }
            });
          } else if (scope.type === 'trend') {
            var labels = data.map(function(item) { return item.month; });
            var values = data.map(function(item) { return item.totalSpend; });
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: values,
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
                },
                tooltips: { enabled: true }
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