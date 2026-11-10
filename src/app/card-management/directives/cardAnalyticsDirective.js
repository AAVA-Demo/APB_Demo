(function() {
  'use strict';
  angular.module('cardManagementModule').directive('cardAnalytics', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        spendData: '='
      },
      template: '<div class="chart-container">' +
                '  <h4>Monthly Spend Trend</h4>' +
                '  <canvas id="cardSpendChart" width="400" height="200"></canvas>' +
                '</div>',
      link: function(scope, element) {
        var chart = null;
        function renderChart() {
          if (!scope.spendData || !scope.spendData.spendTrend) {
            return;
          }
          var ctx = element.find('canvas')[0].getContext('2d');
          var labels = scope.spendData.spendTrend.map(function(item) { return item.month; });
          var data = scope.spendData.spendTrend.map(function(item) { return item.amount; });
          if (chart) {
            chart.destroy();
          }
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Monthly Spend',
                data: data,
                borderColor: '#337ab7',
                backgroundColor: 'rgba(51, 122, 183, 0.1)',
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }]
              }
            }
          });
        }
        scope.$watch('spendData', function(newVal) {
          if (newVal) {
            $timeout(function() {
              renderChart();
            }, 100);
          }
        });
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
})();