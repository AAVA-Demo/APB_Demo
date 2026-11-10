(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartDirective', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        scope: {
          chartData: '=',
          chartId: '@'
        },
        link: function(scope, element, attrs) {
          var chart = null;
          scope.$watch('chartData', function(newData) {
            if (newData) {
              $timeout(function() {
                if (chart) {
                  chart.destroy();
                }
                var ctx = element[0].getContext('2d');
                var config = {
                  type: newData.type || 'bar',
                  data: {
                    labels: newData.labels || [],
                    datasets: [{
                      label: 'Amount (₹)',
                      data: newData.data || [],
                      backgroundColor: newData.type === 'pie' ? [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                      ] : 'rgba(54, 162, 235, 0.6)',
                      borderColor: newData.type === 'line' ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                      display: newData.type === 'pie'
                    },
                    scales: newData.type !== 'pie' ? {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    } : {}
                  }
                };
                chart = new Chart(ctx, config);
              }, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (chart) {
              chart.destroy();
            }
          });
        }
      };
    }]);
})();