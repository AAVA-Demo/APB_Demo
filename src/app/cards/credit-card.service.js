(function() {
  'use strict';
  angular.module('app.cards')
    .service('CreditCardService', ['$http', '$q', 'MockDataService', function($http, $q, MockDataService) {
      var cardCache = null;
      var cardCacheTime = null;
      var CACHE_TTL = 5 * 60 * 1000;
      
      this.getAllCards = function() {
        var now = new Date().getTime();
        if (cardCache && cardCacheTime && (now - cardCacheTime) < CACHE_TTL) {
          return $q.resolve(cardCache);
        }
        return MockDataService.getAllCards()
          .then(function(cards) {
            cardCache = cards;
            cardCacheTime = now;
            return cards;
          });
      };
      
      this.getCardDetails = function(cardId) {
        return MockDataService.getCardDetails(cardId);
      };
      
      this.clearCache = function() {
        cardCache = null;
        cardCacheTime = null;
      };
    }]);
})();