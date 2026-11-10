(function() {
  'use strict';
  angular.module('analyticsModule').service('ChartService', [function() {
    var categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
    
    this.prepareCategoryChartData = function(categorySpending) {
      if (!categorySpending || categorySpending.length === 0) {
        return null;
      }
      var labels = [];
      var data = [];
      var colors = [];
      categorySpending.forEach(function(item, index) {
        labels.push(item.category);
        data.push(item.amount);
        colors.push(categoryColors[index % categoryColors.length]);
      });
      return {
        labels: labels,
        data: data,
        colors: colors,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {display: true, position: 'right'},
          tooltips: {enabled: true}
        }
      };
    };
    
    this.prepareTrendChartData = function(monthlyTrend) {
      if (!monthlyTrend || monthlyTrend.length === 0) {
        return null;
      }
      var labels = [];
      var data = [];
      monthlyTrend.forEach(function(item) {
        labels.push(item.month);
        data.push(item.totalSpend);
      });
      return {
        labels: labels,
        series: ['Monthly Spend'],
        data: [data],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true}
            }]
          }
        }
      };
    };
    
    this.prepareCardComparisonData = function(cardSpending) {
      if (!cardSpending || cardSpending.length === 0) {
        return null;
      }
      var labels = [];
      var data = [];
      cardSpending.forEach(function(item) {
        labels.push(item.cardName);
        data.push(item.totalSpend);
      });
      return {
        labels: labels,
        series: ['Card Spend'],
        data: [data],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {beginAtZero: true}
            }]
          }
        }
      };
    };
  }]);
})();