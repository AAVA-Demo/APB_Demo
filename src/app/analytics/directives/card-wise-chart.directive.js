(function() {
  'use strict';
  angular.module('app.analytics').directive('cardWiseChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '='
      },
      template: '<div class="chart-container">' +
                '  <h4>Card-wise Spending</h4>' +
                '  <canvas id="cardWiseChart" width="400" height="200"></canvas>' +
                '</div>',
      link: function(scope, element) {
        var ctx = element.find('canvas')[0].getContext('2d');
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            var labels = newData.map(function(d) { return d.cardName; });
            var data = newData.map(function(d) { return d.totalSpend; });
            var colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'];
            if (chart) chart.destroy();
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
                maintainAspectRatio: true
              }
            });
          }
        });
      }
    };
  }]);
})();