(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var service = {
        getCards: getCards,
        getCardById: getCardById
      };
      return service;
      function getCards(userId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + (userId || 'current'))
          .then(function(response) {
            var cards = response.data.map(function(card) {
              return {
                cardId: card.cardId,
                cardNumber: card.cardNumber,
                cardType: card.cardType,
                cardHolderName: card.cardHolderName,
                creditLimit: card.creditLimit,
                availableCredit: card.availableCredit,
                outstandingBalance: card.outstandingBalance,
                utilizationRate: card.utilizationRate || ((card.outstandingBalance / card.creditLimit) * 100),
                expiryDate: card.expiryDate,
                issuer: card.issuer,
                status: card.status
              };
            });
            deferred.resolve(cards);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
      function getCardById(cardId) {
        var deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/detail/' + cardId)
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      }
    }]);
})();