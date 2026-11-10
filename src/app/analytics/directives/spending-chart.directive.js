(function() {
  'use strict';
  angular.module('app.analytics').directive('spendingChart', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartType: '@',
        chartData: '=',
        chartTitle: '@'
      },
      template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        let chartInstance = null;
        function renderChart() {
          if (!scope.chartData || scope.chartData.length === 0) {
            return;
          }
          $timeout(function() {
            const canvas = document.getElementById(scope.chartId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (chartInstance) {
              chartInstance.destroy();
            }
            if (scope.chartType === 'pie') {
              const labels = scope.chartData.map(d => d.category);
              const data = scope.chartData.map(d => d.total);
              const backgroundColors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
              ];
              chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: data,
                    backgroundColor: backgroundColors
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  title: {
                    display: true,
                    text: scope.chartTitle
                  },
                  onClick: function(evt, item) {
                    if (item.length > 0) {
                      const index = item[0]._index;
                      const category = labels[index];
                      scope.$emit('category-selected', category);
                    }
                  }
                }
              });
            } else if (scope.chartType === 'line') {
              const labels = scope.chartData.map(d => d.month);
              const data = scope.chartData.map(d => d.totalSpend);
              chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Monthly Spend',
                    data: data,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  title: {
                    display: true,
                    text: scope.chartTitle
                  },
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                          return '$' + value.toFixed(2);
                        }
                      }
                    }]
                  }
                }
              });
            }
          }, 100);
        }
        scope.$watch('chartData', function(newVal, oldVal) {
          if (newVal) {
            renderChart();
          }
        }, true);
        scope.$on('$destroy', function() {
          if (chartInstance) {
            chartInstance.destroy();
          }
        });
      }
    };
  }]);
})();