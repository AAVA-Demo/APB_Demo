(function() {
  'use strict';
  angular.module('creditCardApp').service('CategoryService', ['$http', function($http) {
    const categories = [
      { id: 1, name: 'Food & Dining', icon: 'utensils', color: '#e74c3c' },
      { id: 2, name: 'Fuel', icon: 'gas-pump', color: '#f39c12' },
      { id: 3, name: 'Shopping', icon: 'shopping-cart', color: '#9b59b6' },
      { id: 4, name: 'Travel', icon: 'plane', color: '#3498db' },
      { id: 5, name: 'Entertainment', icon: 'film', color: '#1abc9c' },
      { id: 6, name: 'Utilities', icon: 'bolt', color: '#34495e' },
      { id: 7, name: 'Healthcare', icon: 'heartbeat', color: '#e67e22' },
      { id: 8, name: 'Education', icon: 'graduation-cap', color: '#16a085' },
      { id: 9, name: 'Miscellaneous', icon: 'ellipsis-h', color: '#95a5a6' }
    ];
    this.getCategories = function() {
      return categories;
    };
    this.categorizeTransactions = function(transactions) {
      return transactions.map(txn => {
        if (!txn.categoryId) {
          txn.categoryId = this._inferCategory(txn.description || txn.merchant || '');
        }
        return txn;
      });
    };
    this._inferCategory = function(description) {
      const lower = description.toLowerCase();
      if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe')) return 1;
      if (lower.includes('gas') || lower.includes('fuel') || lower.includes('petrol')) return 2;
      if (lower.includes('shop') || lower.includes('store') || lower.includes('retail')) return 3;
      if (lower.includes('airline') || lower.includes('hotel') || lower.includes('travel')) return 4;
      if (lower.includes('movie') || lower.includes('entertainment') || lower.includes('concert')) return 5;
      if (lower.includes('electric') || lower.includes('water') || lower.includes('utility')) return 6;
      if (lower.includes('hospital') || lower.includes('pharmacy') || lower.includes('medical')) return 7;
      if (lower.includes('school') || lower.includes('university') || lower.includes('education')) return 8;
      return 9;
    };
  }]);
})();