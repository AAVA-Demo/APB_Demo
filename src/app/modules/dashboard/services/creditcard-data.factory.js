(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
      const API_BASE = 'https://api.example.com';
      let cachedCards = null;
      let cacheTime = null;
      const CACHE_DURATION = 300000;
      return {
        getCards: function() {
          if (cachedCards && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
            return $q.resolve(cachedCards);
          }
          return $http.get(API_BASE + '/api/cards').then(function(response) {
            cachedCards = response.data.map(card => ({
              cardId: card.cardId,
              cardNumber: '****' + card.cardNumber.slice(-4),
              creditLimit: card.creditLimit,
              currentBalance: card.currentBalance,
              availableCredit: card.creditLimit - card.currentBalance
            }));
            cacheTime = Date.now();
            return cachedCards;
          }).catch(function() {
            return [
              {cardId: '1', cardNumber: '****1234', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500},
              {cardId: '2', cardNumber: '****5678', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000}
            ];
          });
        },
        clearCache: function() {
          cachedCards = null;
          cacheTime = null;
        }
      };
    }]);
})();