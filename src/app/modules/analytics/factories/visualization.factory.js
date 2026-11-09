(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('VisualizationFactory', [function() {
      var factory = {};
      var colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
      factory.createPieChart = function(ctx, data, onClickCallback) {
        var labels = data.map(function(item) { return item.category; });
        var values = data.map(function(item) { return item.totalAmount; });
        return new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: colorPalette,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Category-wise Spending' }
            },
            onClick: function(event, elements) {
              if (elements.length > 0) {
                var index = elements[0].index;
                var category = labels[index];
                if (onClickCallback) {
                  onClickCallback({ category: category });
                }
              }
            }
          }
        });
      };
      factory.createLineChart = function(ctx, data) {
        var labels = data.map(function(item) { return item.month; });
        var values = data.map(function(item) { return item.totalSpend; });
        return new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Monthly Spend',
              data: values,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'Monthly Spending Trend' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      };
      factory.createBarChart = function(ctx, data) {
        var labels = data.map(function(item) { return item.category; });
        var values = data.map(function(item) { return item.totalAmount; });
        return new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Spending by Category',
              data: values,
              backgroundColor: colorPalette,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Category Spending Breakdown' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      };
      return factory;
    }]);
})();