(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .directive('trendChart', ['$timeout', trendChart]);
  function trendChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="trendChartCanvas"></canvas>',
      link: function(scope, element, attrs) {
        var chart = null;
        var canvas = element.find('canvas')[0];
        var ctx = canvas.getContext('2d');
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            $timeout(function() {
              renderChart(newData);
            }, 100);
          }
        });
        function renderChart(data) {
          if (chart) {
            chart.destroy();
          }
          var labels = data.map(function(item) { return item.month; });
          var amounts = data.map(function(item) { return item.totalSpend; });
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Monthly Spend',
                data: amounts,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true,
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
                      return '$' + value.toFixed(2);
                    }
                  }
                }]
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem) {
                    return 'Spend: $' + tooltipItem.yLabel.toFixed(2);
                  }
                }
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
  }
})();