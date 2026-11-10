(function() {
  'use strict';
  angular.module('creditCardApp').directive('analyticsChart', ['categoryService', function(categoryService) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas id="{{chartId}}"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var ctx = null;
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            if (!ctx) {
              ctx = document.getElementById(scope.chartId).getContext('2d');
            }
            if (chart) {
              chart.destroy();
            }
            var chartConfig = {};
            if (scope.chartType === 'pie') {
              chartConfig = {
                type: 'pie',
                data: {
                  labels: newData.map(function(item) { return item.category; }),
                  datasets: [{
                    data: newData.map(function(item) { return item.totalSpend; }),
                    backgroundColor: newData.map(function(item) { return categoryService.getCategoryColor(item.category); })
                  }]
                },
                options: {
                  responsive: true,
                  legend: { position: 'right' },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.index];
                        var value = data.datasets[0].data[tooltipItem.index];
                        return label + ': ₹' + value.toFixed(2);
                      }
                    }
                  }
                }
              };
            } else if (scope.chartType === 'line') {
              chartConfig = {
                type: 'line',
                data: {
                  labels: newData.map(function(item) { return item.month; }),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: newData.map(function(item) { return item.totalSpend; }),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    yAxes: [{
                      ticks: {
                        callback: function(value) { return '₹' + value.toFixed(2); }
                      }
                    }]
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem) {
                        return 'Spend: ₹' + tooltipItem.yLabel.toFixed(2);
                      }
                    }
                  }
                }
              };
            }
            chart = new Chart(ctx, chartConfig);
          }
        }, true);
      }
    };
  }]);
})();