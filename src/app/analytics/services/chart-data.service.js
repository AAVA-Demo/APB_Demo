(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('ChartDataService', ['CategoryFactory', function(CategoryFactory) {
      var service = this;
      service.transformMonthlyTrends = function(rawData) {
        var labels = [];
        var data = [];
        angular.forEach(rawData, function(item) {
          labels.push(item.month);
          data.push(item.totalSpend);
        });
        return {
          labels: labels,
          datasets: [{
            label: 'Monthly Spend',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        };
      };
      service.transformCategoryBreakdown = function(rawData) {
        var labels = [];
        var data = [];
        var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
        angular.forEach(rawData, function(item) {
          labels.push(item.category);
          data.push(item.amount);
        });
        return {
          labels: labels,
          datasets: [{
            label: 'Category Spending',
            data: data,
            backgroundColor: colors
          }]
        };
      };
      service.transformCardWiseSpend = function(rawData) {
        var labels = [];
        var data = [];
        angular.forEach(rawData, function(item) {
          labels.push(item.cardName);
          data.push(item.totalSpend);
        });
        return {
          labels: labels,
          datasets: [{
            label: 'Card-wise Spend',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }]
        };
      };
    }]);
})();