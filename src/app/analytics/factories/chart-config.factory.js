(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('ChartConfigFactory', [function() {
      var factory = {
        getCategoryChartConfig: getCategoryChartConfig,
        getTrendChartConfig: getTrendChartConfig
      };
      return factory;
      function getCategoryChartConfig(data) {
        var labels = data.map(function(item) { return item.category; });
        var amounts = data.map(function(item) { return item.totalAmount; });
        var colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
        ];
        return {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: amounts,
              backgroundColor: colors.slice(0, data.length),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: 'bottom'
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var label = data.labels[tooltipItem.index] || '';
                  var value = data.datasets[0].data[tooltipItem.index];
                  return label + ': $' + value.toFixed(2);
                }
              }
            }
          }
        };
      }
      function getTrendChartConfig(data) {
        var labels = data.map(function(item) { return item.month; });
        var amounts = data.map(function(item) { return item.totalSpend; });
        return {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monthly Spending',
              data: amounts,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
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
      }
    }]);
})();