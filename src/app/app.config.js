(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        creditCards: '/creditcards',
        userCards: '/users/:userId/cards',
        monthlyTransactions: '/transactions/monthly',
        transactions: '/transactions',
        cardDetails: '/cards/:cardId'
      }
    });
})();