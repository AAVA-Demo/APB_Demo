(function() {
  'use strict';
  angular.module('creditCardApp').factory('CategoryService', [function() {
    var categories = [
      { categoryId: '1', categoryName: 'Food & Dining', iconClass: 'glyphicon-cutlery', colorCode: '#FF6384' },
      { categoryId: '2', categoryName: 'Fuel', iconClass: 'glyphicon-oil', colorCode: '#36A2EB' },
      { categoryId: '3', categoryName: 'Shopping', iconClass: 'glyphicon-shopping-cart', colorCode: '#FFCE56' },
      { categoryId: '4', categoryName: 'Travel', iconClass: 'glyphicon-plane', colorCode: '#4BC0C0' },
      { categoryId: '5', categoryName: 'Entertainment', iconClass: 'glyphicon-film', colorCode: '#9966FF' },
      { categoryId: '6', categoryName: 'Utilities', iconClass: 'glyphicon-flash', colorCode: '#FF9F40' },
      { categoryId: '7', categoryName: 'Healthcare', iconClass: 'glyphicon-heart', colorCode: '#FF6384' },
      { categoryId: '8', categoryName: 'Education', iconClass: 'glyphicon-education', colorCode: '#C9CBCF' },
      { categoryId: '9', categoryName: 'Miscellaneous', iconClass: 'glyphicon-th', colorCode: '#4BC0C0' }
    ];
    function getCategories() {
      return categories;
    }
    function getCategoryById(categoryId) {
      return categories.find(function(cat) {
        return cat.categoryId === categoryId;
      });
    }
    return {
      getCategories: getCategories,
      getCategoryById: getCategoryById
    };
  }]);
})();