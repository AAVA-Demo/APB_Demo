(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          type: '@'
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          var chart = null;
          scope.$watch('data', function(newData) {
            if (!newData) return;
            var canvas = element.find('canvas')[0];
            var ctx = canvas.getContext('2d');
            if (chart) chart.destroy();
            if (scope.type === 'pie') {
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: newData.map(function(d) { return d.category; }),
                  datasets: [{
                    data: newData.map(function(d) { return d.amount; }),
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0']
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: { position: 'right' }
                }
              });
            } else if (scope.type === 'line') {
              chart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: newData.map(function(d) { return d.month; }),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: newData.map(function(d) { return d.totalSpend; }),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [{
                      ticks: { beginAtZero: true }
                    }]
                  }
                }
              });
            }
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    });
})();