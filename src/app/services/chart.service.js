(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('ChartService', [function() {
      function prepareCategoryChart(categorySpend) {
        var labels = [];
        var data = [];
        var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
        categorySpend.forEach(function(item) {
          labels.push(item.category);
          data.push(item.totalSpend);
        });
        return {
          labels: labels,
          data: data,
          colors: colors,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {display: true, position: 'bottom'},
            onClick: function(evt, items) {}
          }
        };
      }
      function prepareTrendChart(monthlyTrends) {
        var labels = [];
        var data = [];
        monthlyTrends.forEach(function(item) {
          labels.push(item.month);
          data.push(item.totalSpend);
        });
        return {
          labels: labels,
          datasets: [{
            label: 'Monthly Spend',
            data: data,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true
          }],
          options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {display: true},
            scales: {
              yAxes: [{
                ticks: {beginAtZero: true}
              }]
            }
          }
        };
      }
      return {
        prepareCategoryChart: prepareCategoryChart,
        prepareTrendChart: prepareTrendChart
      };
    }]);
})();