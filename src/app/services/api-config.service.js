(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        creditCards: '/creditcards',
        transactions: '/transactions',
        analytics: '/analytics/spending'
      },
      timeout: 10000
    });
})();