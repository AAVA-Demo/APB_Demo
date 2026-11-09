(function() {
  'use strict';
  angular.module('creditCard.management')
    .service('CardManagementService', ['CreditCardDataFactory', 'TransactionFactory', 'UserAuthFactory', '$q', function(CreditCardDataFactory, TransactionFactory, UserAuthFactory, $q) {
      var cachedCards = null;
      var cacheTimestamp = null;
      var CACHE_TTL = 5000;
      this.getAllCards = function() {
        var now = new Date().getTime();
        if (cachedCards && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
          return $q.resolve(cachedCards);
        }
        var deferred = $q.defer();
        UserAuthFactory.validateUser().then(function(userResult) {
          return CreditCardDataFactory.fetchCards();
        }).then(function(cardsResult) {
          var cards = cardsResult.data;
          var cardIds = cards.map(function(c) { return c.cardId; });
          return $q.all([cards, TransactionFactory.fetchCardSpending(cardIds)]);
        }).then(function(results) {
          var cards = results[0];
          var spendData = results[1].data;
          var aggregatedCards = cards.map(function(card) {
            var spend = spendData.find(function(s) { return s.cardId === card.cardId; });
            return angular.extend({}, card, spend);
          });
          cachedCards = aggregatedCards;
          cacheTimestamp = now;
          deferred.resolve(aggregatedCards);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.getCardDetails = function(cardId) {
        var deferred = $q.defer();
        $q.all([
          CreditCardDataFactory.getCardById(cardId),
          TransactionFactory.fetchCardSpending([cardId])
        ]).then(function(results) {
          var card = results[0].data;
          var spendData = results[1].data[0];
          var cardDetails = angular.extend({}, card, spendData);
          deferred.resolve(cardDetails);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();