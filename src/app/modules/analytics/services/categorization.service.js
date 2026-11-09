(function() {
  'use strict';
  angular.module('app.analytics')
    .service('CategorizationService', [function() {
      var self = this;
      var categories = [
        { categoryId: 'food', categoryName: 'Food & Dining', color: '#FF6384', icon: 'cutlery' },
        { categoryId: 'fuel', categoryName: 'Fuel', color: '#36A2EB', icon: 'tint' },
        { categoryId: 'shopping', categoryName: 'Shopping', color: '#FFCE56', icon: 'shopping-cart' },
        { categoryId: 'travel', categoryName: 'Travel', color: '#4BC0C0', icon: 'plane' },
        { categoryId: 'entertainment', categoryName: 'Entertainment', color: '#9966FF', icon: 'film' },
        { categoryId: 'utilities', categoryName: 'Utilities', color: '#FF9F40', icon: 'bolt' },
        { categoryId: 'healthcare', categoryName: 'Healthcare', color: '#FF6384', icon: 'heartbeat' },
        { categoryId: 'education', categoryName: 'Education', color: '#C9CBCF', icon: 'book' },
        { categoryId: 'misc', categoryName: 'Miscellaneous', color: '#4BC0C0', icon: 'ellipsis-h' }
      ];
      self.getCategories = function() {
        return categories;
      };
      self.getCategoryByName = function(name) {
        return categories.find(function(cat) {
          return cat.categoryName === name;
        });
      };
    }]);
})();