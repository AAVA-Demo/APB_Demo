(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_ENDPOINTS', {
    CARDS: '/api/cards',
    TRANSACTIONS: '/api/transactions',
    MONTHLY_TRANSACTIONS: '/api/transactions/monthly'
  });
})();