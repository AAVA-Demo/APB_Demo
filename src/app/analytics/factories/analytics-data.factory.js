(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('AnalyticsDataFactory', ['CategoryService', AnalyticsDataFactory]);

  function AnalyticsDataFactory(CategoryService) {
    var factory = {
      formatMonthlyTrends: formatMonthlyTrends,
      formatCardWiseSpending: formatCardWiseSpending,
      formatCategorySpending: formatCategorySpending
    };
    return factory;

    function formatMonthlyTrends(data) {
      var labels = [];
      var values = [];
      
      data.forEach(function(item) {
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var monthIndex = parseInt(item.month) - 1;
        labels.push(monthNames[monthIndex] + ' ' + item.year);
        values.push(item.totalSpend);
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Monthly Spend',
          data: values,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true
        }]
      };
    }

    function formatCardWiseSpending(data) {
      var labels = [];
      var values = [];
      var colors = [];
      
      data.forEach(function(item) {
        labels.push(item.cardName);
        values.push(item.totalSpend);
        colors.push('#' + Math.floor(Math.random()*16777215).toString(16));
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Card-wise Spending',
          data: values,
          backgroundColor: colors
        }]
      };
    }

    function formatCategorySpending(data) {
      var labels = [];
      var values = [];
      var colors = [];
      
      data.forEach(function(item) {
        labels.push(item.category);
        values.push(item.totalSpend);
        colors.push(CategoryService.getCategoryColor(item.category));
      });

      return {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors
        }]
      };
    }
  }
})();