(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="spendingChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart;
          scope.$watch('data', function(newData) {
            if (newData && newData.monthlyTrends) {
              const ctx = element.find('canvas')[0].getContext('2d');
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: newData.monthlyTrends.map(t => t.month),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: newData.monthlyTrends.map(t => t.totalSpend),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
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
    }])
    .directive('categoryBreakdown', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<canvas id="categoryChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart;
          scope.$watch('data', function(newData) {
            if (newData && newData.categoryBreakdown) {
              const ctx = element.find('canvas')[0].getContext('2d');
              if (chart) {
                chart.destroy();
              }
              const colors = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)',
                'rgba(83, 102, 255, 0.8)',
                'rgba(255, 99, 255, 0.8)'
              ];
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: newData.categoryBreakdown.map(c => c.category),
                  datasets: [{
                    data: newData.categoryBreakdown.map(c => c.amount),
                    backgroundColor: colors
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    position: 'right'
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
    }]);
})();