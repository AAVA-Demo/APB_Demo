(function() {
  'use strict';
  angular.module('app.analytics').directive('spendTrendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<div class="chart-container">' +
                '  <h4>Monthly Spend Trends</h4>' +
                '  <canvas id="spendTrendChart" width="400" height="150"></canvas>' +
                '</div>',
      link: function(scope, element) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            var labels = newData.map(function(d) { return d.month; });
            var data = newData.map(function(d) { return d.totalSpend; });
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: data,
                  borderColor: '#007bff',
                  backgroundColor: 'rgba(0, 123, 255, 0.1)',
                  tension: 0.4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  yAxes: [{
                    ticks: { beginAtZero: true }
                  }]
                }
              }
            });
          }
        });
      }
    };
  }]);
})();