(function() {
  'use strict';
  angular.module('creditCardApp.analytics').directive('spendingChart', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@',
        chartTitle: '@'
      },
      template: '<div class="chart-container"><h4>{{ chartTitle }}</h4><canvas id="{{ chartId }}" class="chart"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
        var chart;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.data) {
            $timeout(function() {
              renderChart(newData);
            }, 0);
          }
        }, true);
        function renderChart(data) {
          var ctx = document.getElementById(scope.chartId);
          if (!ctx) return;
          if (chart) {
            chart.destroy();
          }
          var labels = data.data.map(function(item) { return item.label; });
          var values = data.data.map(function(item) { return item.value; });
          chart = new Chart(ctx, {
            type: scope.chartType || 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: scope.chartTitle,
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
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
          });
        }
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
  spendingChart.$inject = ['$timeout'];
})();