(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.demo',
      endpoints: {
        dashboard: '/api/dashboard',
        transactions: '/api/transactions',
        analytics: '/api/analytics/spending'
      },
      timeout: 10000
    });
})();