(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_CONFIG', {
    baseUrl: '/api',
    endpoints: {
      cards: '/api/cards',
      transactions: '/api/transactions',
      categorizedTransactions: '/api/transactions/categorized'
    }
  });
})();