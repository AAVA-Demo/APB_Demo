(function() {
  'use strict';
  angular.module('analyticsModule')
    .factory('CategoryService', [function() {
      var categories = [
        { categoryName: 'Food & Dining', color: '#FF6384', icon: 'glyphicon-cutlery' },
        { categoryName: 'Fuel', color: '#36A2EB', icon: 'glyphicon-oil' },
        { categoryName: 'Shopping', color: '#FFCE56', icon: 'glyphicon-shopping-cart' },
        { categoryName: 'Travel', color: '#4BC0C0', icon: 'glyphicon-plane' },
        { categoryName: 'Entertainment', color: '#9966FF', icon: 'glyphicon-film' },
        { categoryName: 'Utilities', color: '#FF9F40', icon: 'glyphicon-flash' },
        { categoryName: 'Healthcare', color: '#FF6384', icon: 'glyphicon-heart' },
        { categoryName: 'Education', color: '#C9CBCF', icon: 'glyphicon-education' },
        { categoryName: 'Miscellaneous', color: '#7CB342', icon: 'glyphicon-th' }
      ];
      return {
        getCategories: function() {
          return categories;
        },
        getCategoryColor: function(categoryName) {
          var cat = categories.find(function(c) { return c.categoryName === categoryName; });
          return cat ? cat.color : '#999999';
        }
      };
    }]);
})();