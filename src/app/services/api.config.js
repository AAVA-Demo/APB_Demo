(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      BASE_URL: 'https://api.creditcard.demo.com',
      ENDPOINTS: {
        CREDIT_CARDS: '/api/creditcards',
        TRANSACTIONS: '/api/transactions',
        TRANSACTION_SUMMARY: '/api/transactions/summary',
        ANALYTICS_TRENDS: '/api/analytics/trends',
        ANALYTICS_CATEGORIES: '/api/analytics/categories',
        ANALYTICS_CARDS: '/api/analytics/cards'
      },
      TIMEOUT: 10000
    });
})();