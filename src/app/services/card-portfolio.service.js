(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardPortfolioService', ['CreditCardDataFactory', function(CreditCardDataFactory) {
      let cachedCards = null;
      this.getAllCards = function() {
        if (cachedCards) {
          return Promise.resolve(cachedCards);
        }
        return CreditCardDataFactory.fetchCards().then(function(cards) {
          cachedCards = cards;
          return cards;
        });
      };
      this.clearCache = function() {
        cachedCards = null;
      };
    }]);
})();