(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardService', ['$http', '$q', '$cacheFactory', CardService]);
  function CardService($http, $q, $cacheFactory) {
    var service = this;
    var cache = $cacheFactory('cardCache');
    service.getCardSummaries = function(cardIds) {
      var cacheKey = 'summaries_' + cardIds.join('_');
      var cached = cache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/cards/summary',
        params: { cardIds: cardIds.join(',') },
        timeout: 1000
      }).then(function(response) {
        var summaries = response.data.map(function(card) {
          card.cardNumber = service.maskCardNumber(card.cardNumber);
          return card;
        });
        cache.put(cacheKey, summaries);
        setTimeout(function() { cache.remove(cacheKey); }, 120000);
        deferred.resolve(summaries);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    service.getCardDetail = function(cardId) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/api/cards/' + cardId + '/detail',
        timeout: 1000
      }).then(function(response) {
        var detail = response.data;
        detail.cardNumber = service.maskCardNumber(detail.cardNumber);
        deferred.resolve(detail);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    service.maskCardNumber = function(cardNumber) {
      if (!cardNumber || cardNumber.length < 4) return 'XXXX-XXXX-XXXX-XXXX';
      var lastFour = cardNumber.slice(-4);
      return 'XXXX-XXXX-XXXX-' + lastFour;
    };
  }
})();