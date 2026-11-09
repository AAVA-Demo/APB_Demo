(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$timeout', function($timeout) {
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
          function renderChart() {
            if (!scope.chartData || scope.chartData.length === 0) return;
            $timeout(function() {
              var canvas = document.getElementById(scope.canvasId);
              if (!canvas) return;
              var ctx = canvas.getContext('2d');
              if (chart) chart.destroy();
              if (scope.chartType === 'pie') {
                var labels = scope.chartData.map(function(d) { return d.name; });
                var data = scope.chartData.map(function(d) { return d.amount; });
                var colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
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
                    plugins: {
                      legend: { position: 'right' }
                    }
                  }
                });
              } else if (scope.chartType === 'line') {
                var labels = scope.chartData.map(function(d) { return d.month; });
                var data = scope.chartData.map(function(d) { return d.totalSpend; });
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: data,
                      borderColor: '#3498db',
                      backgroundColor: 'rgba(52, 152, 219, 0.2)',
                      tension: 0.3
                    }]
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      legend: { display: true }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }
                });
              }
            }, 100);
          }
          scope.$watch('chartData', function(newVal) {
            if (newVal) renderChart();
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();