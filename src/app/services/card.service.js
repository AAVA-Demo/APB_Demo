(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardService', CardService);
  CardService.$inject = ['$http', '$q', '$cacheFactory'];
  function CardService($http, $q, $cacheFactory) {
    var cache = $cacheFactory('cardCache', {capacity: 10});
    var service = {
      getUserCards: getUserCards,
      getCardDetails: getCardDetails,
      getCardSpend: getCardSpend
    };
    return service;
    function getUserCards() {
      var userId = 'current';
      var cacheKey = 'userCards_' + userId;
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get('/api/users/' + userId + '/cards')
        .then(function(response) {
          var cards = response.data;
          cache.put(cacheKey, cards);
          return cards;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
    function getCardDetails(cardId) {
      var cacheKey = 'cardDetails_' + cardId;
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      return $http.get('/api/cards/' + cardId)
        .then(function(response) {
          var card = response.data;
          cache.put(cacheKey, card);
          return card;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
    function getCardSpend(cardId) {
      return $http.get('/api/cards/' + cardId + '/spend')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    }
  }
})();