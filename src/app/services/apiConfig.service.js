(function() {
  'use strict';
  angular.module('creditCardApp').constant('apiConfig', {
    baseUrl: '/api',
    endpoints: {
      creditCards: '/creditcards',
      transactions: '/transactions',
      monthlyTransactions: '/transactions/monthly',
      cards: '/cards',
      cardMetadata: '/cards/{id}/metadata'
    },
    timeout: 5000
  });
})();