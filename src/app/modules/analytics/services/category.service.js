(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('CategoryService', ['TransactionService', CategoryService]);
  function CategoryService(TransactionService) {
    const categories = [
      { name: 'Food & Dining', color: '#FF6384' },
      { name: 'Fuel', color: '#36A2EB' },
      { name: 'Shopping', color: '#FFCE56' },
      { name: 'Travel', color: '#4BC0C0' },
      { name: 'Entertainment', color: '#9966FF' },
      { name: 'Utilities', color: '#FF9F40' },
      { name: 'Healthcare', color: '#FF6384' },
      { name: 'Education', color: '#C9CBCF' },
      { name: 'Miscellaneous', color: '#4BC0C0' }
    ];
    const service = {
      classifyTransactions: classifyTransactions,
      getCategories: getCategories,
      getCategoryColor: getCategoryColor
    };
    return service;
    function classifyTransactions(transactions) {
      return transactions;
    }
    function getCategories() {
      return categories;
    }
    function getCategoryColor(categoryName) {
      const cat = categories.find(function(c) { return c.name === categoryName; });
      return cat ? cat.color : '#999999';
    }
  }
})();