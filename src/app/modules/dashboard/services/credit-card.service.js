(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('CreditCardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var cardCache = new Map();
      self.getAllCards = function() {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards, { timeout: API_CONFIG.timeout })
          .then(function(response) {
            var cards = response.data;
            cards.forEach(function(card) {
              cardCache.set(card.cardId, card);
            });
            deferred.resolve(cards);
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getCardById = function(cardId) {
        if (cardCache.has(cardId)) {
          return $q.resolve(cardCache.get(cardId));
        }
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards + '/' + cardId)
          .then(function(response) {
            cardCache.set(cardId, response.data);
            return response.data;
          });
      };
    }]);
})();