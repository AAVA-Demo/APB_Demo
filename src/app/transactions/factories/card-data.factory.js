(function() {
  'use strict';
  angular.module('transactionModule')
    .factory('CardDataFactory', ['$http', '$q', CardDataFactory]);

  function CardDataFactory($http, $q) {
    var cachedCards = null;
    var factory = {
      getCards: getCards,
      getCardById: getCardById
    };
    return factory;

    function getCards() {
      var deferred = $q.defer();
      
      if (cachedCards) {
        deferred.resolve(cachedCards);
        return deferred.promise;
      }

      $http.get('/api/cards')
        .then(function(response) {
          cachedCards = response.data;
          deferred.resolve(cachedCards);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      
      return deferred.promise;
    }

    function getCardById(cardId) {
      return getCards().then(function(cards) {
        return cards.find(function(card) {
          return card.cardId === cardId;
        });
      });
    }
  }
})();