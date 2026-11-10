(function() {
  'use strict';
  angular.module('creditCardApp').service('CardMappingService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
    var cache = $cacheFactory('cardMappingCache');
    var API_BASE = '/api/cards';
    this.enrichWithCardDetails = function(transactions) {
      var cardIds = transactions.map(function(txn) { return txn.cardId; }).filter(function(id, index, self) {
        return id && self.indexOf(id) === index;
      });
      var promises = cardIds.map(function(cardId) {
        var cached = cache.get(cardId);
        if (cached) { return $q.resolve(cached); }
        return $http.get(API_BASE + '/' + cardId).then(function(response) {
          cache.put(cardId, response.data);
          return response.data;
        });
      });
      return $q.all(promises).then(function(cards) {
        var cardMap = {};
        cards.forEach(function(card) { cardMap[card.cardId] = card; });
        return transactions.map(function(txn) {
          txn.cardDetails = cardMap[txn.cardId] || {};
          return txn;
        });
      });
    };
  }]);
})();