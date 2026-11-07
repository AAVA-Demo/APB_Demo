(function() {
  'use strict';
  angular.module('ccAnalyticsModule').directive('trendChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div class="chart-container"><canvas id="{{chartId}}"></canvas></div>',
      link: function(scope) {
        scope.chartId = 'trend-chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            setTimeout(function() {
              var ctx = document.getElementById(scope.chartId);
              if (ctx) {
                if (chart) chart.destroy();
                var labels = newData.map(function(item) { return item.month; });
                var values = newData.map(function(item) { return item.totalSpend; });
                chart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: values,
                      borderColor: '#5cb85c',
                      backgroundColor: 'rgba(92, 184, 92, 0.1)',
                      fill: true,
                      tension: 0.4
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: true,
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
            }, 100);
          }
        });
        scope.$on('$destroy', function() {
          if (chart) chart.destroy();
        });
      }
    };
  }]);
})();