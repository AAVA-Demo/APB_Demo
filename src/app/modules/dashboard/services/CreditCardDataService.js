(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('CreditCardDataService', ['CardDataFactory', '$q', function(CardDataFactory, $q) {
      let cachedCards = null;
      this.getAllCards = function() {
        if (cachedCards) {
          return $q.resolve(cachedCards);
        }
        return CardDataFactory.fetchCards()
          .then(function(cards) {
            cachedCards = cards;
            return cards;
          });
      };
      this.clearCache = function() {
        cachedCards = null;
      };
    }]);
})();