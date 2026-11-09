(function() {
  'use strict';
  angular.module('creditCardApp').service('CardDataService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
    var cache = null;
    var cacheTime = null;
    var TTL = 300000;
    this.getAllCards = function() {
      if (cache && cacheTime && (Date.now() - cacheTime < TTL)) {
        return $q.resolve(cache);
      }
      return $http.get(API_ENDPOINTS.CARDS).then(function(response) {
        var cards = response.data.map(function(card) {
          return {
            cardId: card.id,
            cardNumber: card.number,
            cardType: card.type,
            creditLimit: card.creditLimit,
            outstandingAmount: card.outstanding,
            availableCredit: card.creditLimit - card.outstanding,
            lastUpdated: new Date(card.lastUpdated)
          };
        });
        cache = cards;
        cacheTime = Date.now();
        return cards;
      });
    };
    this.getCardDetails = function(cardIds) {
      var ids = cardIds.join(',');
      return $http.get(API_ENDPOINTS.CARDS + '?ids=' + ids).then(function(response) {
        return response.data;
      });
    };
  }]);
})();