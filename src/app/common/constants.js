(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_ENDPOINTS', {
      CARDS: '/api/users/:userId/cards',
      CARD_DETAIL: '/api/cards/:cardId',
      TRANSACTIONS: '/api/transactions',
      CARD_TRANSACTIONS: '/api/cards/:cardId/transactions'
    })
    .constant('REFRESH_INTERVAL', 180000);
})();