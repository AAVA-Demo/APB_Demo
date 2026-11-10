(function() {
  'use strict';
  angular.module('analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '@'
        },
        template: '<div class="chart-container"><canvas id="chart-{{$id}}"></canvas></div>',
        link: function(scope, element, attrs) {
          scope.$watch('chartData', function(newData) {
            if (newData && newData.length > 0) {
              var canvas = element.find('canvas')[0];
              var ctx = canvas.getContext('2d');
              var labels, data, backgroundColor;
              if (scope.chartType === 'pie') {
                labels = newData.map(function(d) { return d.category; });
                data = newData.map(function(d) { return d.totalAmount; });
                backgroundColor = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
                new Chart(ctx, {
                  type: 'pie',
                  data: {
                    labels: labels,
                    datasets: [{
                      data: data,
                      backgroundColor: backgroundColor
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false
                  }
                });
              } else if (scope.chartType === 'line') {
                labels = newData.map(function(d) { return d.month; });
                data = newData.map(function(d) { return d.totalSpend; });
                new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Monthly Spend',
                      data: data,
                      borderColor: '#36A2EB',
                      fill: false
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
            }
          });
        }
      };
    }]);
})();