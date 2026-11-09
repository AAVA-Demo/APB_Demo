(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('CategoryService', [CategoryService]);

  function CategoryService() {
    var categories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];

    var colorMap = {
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

    var service = {
      getCategories: getCategories,
      getCategoryColor: getCategoryColor,
      getColorMap: getColorMap
    };
    return service;

    function getCategories() {
      return categories;
    }

    function getCategoryColor(category) {
      return colorMap[category] || '#CCCCCC';
    }

    function getColorMap() {
      return colorMap;
    }
  }
})();