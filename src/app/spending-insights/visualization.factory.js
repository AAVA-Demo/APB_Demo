(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .factory('VisualizationFactory', function() {
      var colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
      return {
        getPieChartConfig: function(data) {
          return {
            type: 'pie',
            data: {
              labels: data.map(function(d) { return d.category; }),
              datasets: [{
                data: data.map(function(d) { return d.totalSpend; }),
                backgroundColor: colors
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: { position: 'bottom' }
            }
          };
        },
        getLineChartConfig: function(data) {
          return {
            type: 'line',
            data: {
              labels: data.map(function(d) { return d.month; }),
              datasets: [{
                label: 'Monthly Spending',
                data: data.map(function(d) { return d.totalSpend; }),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [{ ticks: { beginAtZero: true } }]
              }
            }
          };
        }
      };
    });
})();