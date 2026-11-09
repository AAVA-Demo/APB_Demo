(function() {
  'use strict';
  angular.module('creditCard.analytics').directive('trendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div><canvas id="trendChartCanvas" width="400" height="200"></canvas></div>',
      link: function(scope, element) {
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var ctx = document.getElementById('trendChartCanvas').getContext('2d');
            var labels = newData.map(function(d) { return d.month; });
            var values = newData.map(function(d) { return d.totalSpend; });
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: values,
                  borderColor: '#3498db',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
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
        });
      }
    };
  }]);
})();