(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('chartDirective', [function() {
      return {
        restrict: 'E',
        scope: {
          chartData: '=',
          chartType: '=',
          chartTitle: '='
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element) {
          scope.chartId = 'chart-' + Math.random().toString(36).substring(7);
          let chartInstance = null;
          
          scope.$watch('chartData', function(newData) {
            if (newData && newData.length > 0) {
              const canvas = element.find('canvas')[0];
              const ctx = canvas.getContext('2d');
              
              if (chartInstance) {
                chartInstance.destroy();
              }
              
              let chartConfig = {};
              
              if (scope.chartType === 'pie') {
                chartConfig = {
                  type: 'pie',
                  data: {
                    labels: newData.map(d => d.category),
                    datasets: [{
                      data: newData.map(d => d.totalSpend),
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                    }]
                  },
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: scope.chartTitle
                    },
                    onClick: function(evt, item) {
                      if (item.length > 0) {
                        const index = item[0]._index;
                        console.log('Drill-down into:', newData[index].category);
                      }
                    }
                  }
                };
              } else if (scope.chartType === 'line') {
                chartConfig = {
                  type: 'line',
                  data: {
                    labels: newData.map(d => d.month),
                    datasets: [{
                      label: 'Monthly Spend',
                      data: newData.map(d => d.totalSpend),
                      borderColor: '#36A2EB',
                      fill: false
                    }]
                  },
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: scope.chartTitle
                    },
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    }
                  }
                };
              } else if (scope.chartType === 'bar') {
                chartConfig = {
                  type: 'bar',
                  data: {
                    labels: newData.map(d => d.cardName),
                    datasets: [{
                      label: 'Card Spend',
                      data: newData.map(d => d.totalSpend),
                      backgroundColor: '#4BC0C0'
                    }]
                  },
                  options: {
                    responsive: true,
                    title: {
                      display: true,
                      text: scope.chartTitle
                    },
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    }
                  }
                };
              }
              
              chartInstance = new Chart(ctx, chartConfig);
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