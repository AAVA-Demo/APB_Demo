(function() {
  'use strict';
  angular.module('ccAnalyticsModule').service('CategoryService', [function() {
    var self = this;
    self.categories = [
      { id: 'food', name: 'Food & Dining', icon: 'fa-cutlery', color: '#FF6384' },
      { id: 'fuel', name: 'Fuel', icon: 'fa-car', color: '#36A2EB' },
      { id: 'shopping', name: 'Shopping', icon: 'fa-shopping-cart', color: '#FFCE56' },
      { id: 'travel', name: 'Travel', icon: 'fa-plane', color: '#4BC0C0' },
      { id: 'entertainment', name: 'Entertainment', icon: 'fa-film', color: '#9966FF' },
      { id: 'utilities', name: 'Utilities', icon: 'fa-bolt', color: '#FF9F40' },
      { id: 'healthcare', name: 'Healthcare', icon: 'fa-heartbeat', color: '#FF6384' },
      { id: 'education', name: 'Education', icon: 'fa-graduation-cap', color: '#36A2EB' },
      { id: 'misc', name: 'Miscellaneous', icon: 'fa-ellipsis-h', color: '#C9CBCF' }
    ];
    self.getCategories = function() {
      return self.categories;
    };
    self.getCategoryByName = function(name) {
      return self.categories.find(function(cat) { return cat.name === name; });
    };
  }]);
})();