(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardManagementService', CardManagementService);
  CardManagementService.$inject = ['$http', '$q', 'AuthFactory', 'MockDataService'];
  function CardManagementService($http, $q, AuthFactory, MockDataService) {
    var cardCache = {};
    var allCardsCache = null;
    this.getAllCards = function() {
      if (allCardsCache) {
        return $q.resolve(allCardsCache);
      }
      if (!AuthFactory.validateSession()) {
        return $q.reject('Unauthorized');
      }
      var deferred = $q.defer();
      try {
        var cards = MockDataService.getCards();
        allCardsCache = cards;
        cards.forEach(function(card) {
          cardCache[card.cardId] = card;
        });
        deferred.resolve(cards);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
    this.getCardDetail = function(cardId) {
      if (cardCache[cardId]) {
        var card = cardCache[cardId];
        var spendAnalysis = MockDataService.getCardSpendAnalysis(cardId);
        return $q.resolve({card: card, spendAnalysis: spendAnalysis});
      }
      var deferred = $q.defer();
      try {
        var card = MockDataService.getCardById(cardId);
        if (card) {
          cardCache[cardId] = card;
          var spendAnalysis = MockDataService.getCardSpendAnalysis(cardId);
          deferred.resolve({card: card, spendAnalysis: spendAnalysis});
        } else {
          deferred.reject('Card not found');
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    };
  }
})();