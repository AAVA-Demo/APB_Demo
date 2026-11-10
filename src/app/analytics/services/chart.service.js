(function() {
  'use strict';
  angular.module('analyticsModule').service('ChartService', ChartService);
  ChartService.$inject = [];
  function ChartService() {
    var vm = this;
    vm.generateChartConfig = function(data, type) {
      if (type === 'pie') {
        return {
          labels: data.map(function(d) { return d.category; }),
          data: data.map(function(d) { return d.totalSpend; }),
          options: {
            responsive: true,
            legend: { display: true, position: 'right' },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, chartData) {
                  var label = chartData.labels[tooltipItem.index];
                  var value = chartData.datasets[0].data[tooltipItem.index];
                  return label + ': $' + value.toFixed(2);
                }
              }
            }
          }
        };
      } else if (type === 'line') {
        return {
          labels: data.map(function(d) { return d.month; }),
          series: ['Total Spend'],
          data: [data.map(function(d) { return d.totalSpend; })],
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  callback: function(value) {
                    return '$' + value.toFixed(0);
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem) {
                  return 'Spend: $' + tooltipItem.yLabel.toFixed(2);
                }
              }
            }
          }
        };
      } else if (type === 'bar') {
        return {
          labels: data.map(function(d) { return d.cardName; }),
          series: ['Total Spend'],
          data: [data.map(function(d) { return d.totalSpend; })],
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  callback: function(value) {
                    return '$' + value.toFixed(0);
                  }
                }
              }]
            }
          }
        };
      }
      return {};
    };
  }
})();