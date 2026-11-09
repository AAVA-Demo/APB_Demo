(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('ChartConfigFactory', [function() {
      return {
        generateChartConfig: function(data, type) {
          var config = {
            type: type,
            data: {},
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: { display: true, position: 'bottom' },
              tooltips: { enabled: true, mode: 'index', intersect: false }
            }
          };
          if (type === 'line') {
            config.data = {
              labels: data.map(function(d) { return d.month; }),
              datasets: [{
                label: 'Monthly Spend',
                data: data.map(function(d) { return d.amount; }),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true
              }]
            };
          } else if (type === 'bar') {
            config.data = {
              labels: data.map(function(d) { return d.cardName || d.category; }),
              datasets: [{
                label: 'Spending',
                data: data.map(function(d) { return d.amount; }),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
              }]
            };
          } else if (type === 'pie' || type === 'doughnut') {
            config.data = {
              labels: data.map(function(d) { return d.category || d.cardName; }),
              datasets: [{
                data: data.map(function(d) { return d.amount; }),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
              }]
            };
          }
          return config;
        }
      };
    }]);
})();