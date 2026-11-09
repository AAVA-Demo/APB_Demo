(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardService', ['$http', '$q', '$rootScope', '$cacheFactory', function($http, $q, $rootScope, $cacheFactory) {
      var cache = $cacheFactory('creditCardCache');
      var service = {
        getCards: getCards,
        getCardDetails: getCardDetails
      };
      return service;

      function getCards() {
        var cached = cache.get('allCards');
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get($rootScope.apiBaseUrl + '/api/cards')
          .then(function(response) {
            cache.put('allCards', response.data);
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      }

      function getCardDetails(cardId) {
        return $http.get($rootScope.apiBaseUrl + '/api/cards/' + cardId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      }
    }]);
})();