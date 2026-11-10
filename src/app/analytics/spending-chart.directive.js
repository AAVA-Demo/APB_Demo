(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          type: '=',
          data: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          scope.$watch('data', function(newData) {
            if (!newData || newData.length === 0) return;
            var canvas = element.find('canvas')[0];
            var ctx = canvas.getContext('2d');
            if (chart) chart.destroy();
            if (scope.type === 'category') {
              var labels = newData.map(function(d) { return d.categoryName; });
              var values = newData.map(function(d) { return d.totalAmount; });
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: values,
                    backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6']
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: { position: 'right' }
                }
              });
            } else if (scope.type === 'monthly') {
              var labels = newData.map(function(d) { return d.month; });
              var values = newData.map(function(d) { return d.totalAmount; });
              chart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Monthly Spend',
                    data: values,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{ ticks: { beginAtZero: true } }]
                  }
                }
              });
            }
          });
        }
      };
    }]);
})();