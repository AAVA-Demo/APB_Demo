(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardDataService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
    var cache = $cacheFactory('creditCardCache');
    var API_BASE = '/api/creditcards';
    this.getAllCards = function() {
      var cached = cache.get('allCards');
      if (cached) { return $q.resolve(cached); }
      return $http.get(API_BASE).then(function(response) {
        cache.put('allCards', response.data);
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    this.getCardById = function(cardId) {
      return $http.get(API_BASE + '/' + cardId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();