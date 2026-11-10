(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('VisualizationService', [VisualizationService]);

  function VisualizationService() {
    var categoryColors = {
      'Food & Dining': '#FF6384',
      'Fuel': '#36A2EB',
      'Shopping': '#FFCE56',
      'Travel': '#4BC0C0',
      'Entertainment': '#9966FF',
      'Utilities': '#FF9F40',
      'Healthcare': '#FF6384',
      'Education': '#C9CBCF',
      'Miscellaneous': '#4BC0C0'
    };

    return {
      prepareMonthlyTrendsData: prepareMonthlyTrendsData,
      prepareCategoryData: prepareCategoryData,
      prepareCardWiseData: prepareCardWiseData
    };

    function prepareMonthlyTrendsData(monthlyTrends) {
      return {
        labels: monthlyTrends.map(function(item) { return item.month; }),
        data: [monthlyTrends.map(function(item) { return item.totalSpend; })],
        series: ['Monthly Spend'],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true, callback: function(value) { return '$' + value.toLocaleString(); } } }]
          }
        }
      };
    }

    function prepareCategoryData(categoryWiseSpend) {
      return {
        labels: categoryWiseSpend.map(function(item) { return item.category; }),
        data: categoryWiseSpend.map(function(item) { return item.totalSpend; }),
        colors: categoryWiseSpend.map(function(item) { return categoryColors[item.category] || '#999'; }),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true, position: 'right' },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.labels[tooltipItem.index] || '';
                var value = data.datasets[0].data[tooltipItem.index];
                return label + ': $' + value.toLocaleString();
              }
            }
          }
        }
      };
    }

    function prepareCardWiseData(cardWiseSpend) {
      return {
        labels: cardWiseSpend.map(function(item) { return item.cardName; }),
        data: [cardWiseSpend.map(function(item) { return item.totalSpend; })],
        series: ['Card Spend'],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true, callback: function(value) { return '$' + value.toLocaleString(); } } }]
          }
        }
      };
    }
  }
})();