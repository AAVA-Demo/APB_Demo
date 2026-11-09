(function() {
  'use strict';
  angular.module('creditCardApp').factory('VisualizationFactory', [function() {
    return {
      createPieChart: function(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: colors }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'right' }
          }
        });
      },
      createLineChart: function(canvasId, labels, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monthly Spend',
              data: data,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
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
        });
      },
      createBarChart: function(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Spending by Category',
              data: data,
              backgroundColor: colors
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [{ ticks: { beginAtZero: true } }]
            },
            legend: { display: false }
          }
        });
      }
    };
  }]);
})();