(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('ChartConfigFactory', ['CategoryService', function(CategoryService) {
      return {
        getCategoryPieConfig: function(categoryData) {
          var labels = [];
          var data = [];
          var colors = [];
          categoryData.forEach(function(item) {
            labels.push(item.category);
            data.push(item.totalAmount);
            colors.push(CategoryService.getCategoryColor(item.category));
          });
          return {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: colors
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'right'
              },
              onClick: function(event, elements) {
                if (elements.length > 0) {
                  var index = elements[0]._index;
                  return { category: labels[index], amount: data[index] };
                }
              }
            }
          };
        },
        getMonthlyTrendConfig: function(monthlyData) {
          var labels = [];
          var data = [];
          monthlyData.forEach(function(item) {
            labels.push(item.month);
            data.push(item.totalSpend);
          });
          return {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Monthly Spend',
                data: data,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
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
      };
    }]);
})();