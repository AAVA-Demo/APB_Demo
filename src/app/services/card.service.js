(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      var cache = $cacheFactory('cardCache');
      var CACHE_KEY = 'allCards';
      var CACHE_TTL = 600000;
      var service = {
        getAllCards: getAllCards,
        getCardDetails: getCardDetails,
        clearCache: clearCache
      };
      return service;
      function getAllCards() {
        var cached = cache.get(CACHE_KEY);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        return $http.get('/api/cards')
          .then(function(response) {
            var cards = response.data.map(function(card) {
              return new window.CardModel(card);
            });
            cache.put(CACHE_KEY, { data: cards, timestamp: Date.now() });
            return cards;
          })
          .catch(function(error) {
            console.error('Error fetching cards:', error);
            return $q.reject(error);
          });
      }
      function getCardDetails(cardId) {
        var cached = cache.get(CACHE_KEY);
        if (cached) {
          var card = cached.data.find(function(c) { return c.cardId === cardId; });
          if (card) return $q.resolve(card);
        }
        return $http.get('/api/cards/' + cardId)
          .then(function(response) {
            return new window.CardModel(response.data);
          })
          .catch(function(error) {
            console.error('Error fetching card details:', error);
            return $q.reject(error);
          });
      }
      function clearCache() {
        cache.remove(CACHE_KEY);
      }
    }]);
})();