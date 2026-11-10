(function() {
  'use strict';
  angular.module('analyticsModule').directive('trendChart', function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="trendChart" width="400" height="200"></canvas>',
      link: function(scope, element) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var labels = newData.map(function(item) { return item.month; });
            var values = newData.map(function(item) { return item.totalSpend; });
            if (chart) {
              chart.destroy();
            }
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: values,
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
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
                        return '$' + value.toLocaleString();
                      }
                    }
                  }]
                }
              }
            });
          }
        });
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  });
})();