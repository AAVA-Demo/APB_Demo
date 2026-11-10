(function() {
  'use strict';
  angular.module('app.analytics').factory('ChartConfigFactory', [function() {
    var COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
    return {
      getTrendChartConfig: function(labels, data) {
        return {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monthly Spend',
              data: data,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }]
            }
          }
        };
      },
      getCategoryChartConfig: function(labels, data) {
        return {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: COLORS
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
              position: 'right'
            }
          }
        };
      }
    };
  }]);
})();