(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .directive('spendingChart', ['$timeout', spendingChart]);
  function spendingChart($timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="spendingChartCanvas"></canvas>',
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
          var labels = data.map(function(item) { return item.category; });
          var amounts = data.map(function(item) { return item.totalAmount; });
          var colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
          ];
          chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'right'
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label = data.labels[tooltipItem.index];
                    var value = data.datasets[0].data[tooltipItem.index];
                    var item = scope.data[tooltipItem.index];
                    return label + ': $' + value.toFixed(2) + ' (' + item.percentage + '%)';
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