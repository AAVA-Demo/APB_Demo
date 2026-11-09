(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var factory = {
        getAllCards: getAllCards
      };
      return factory;
      function getAllCards() {
        return $http.get(API_CONFIG.baseUrl + '/creditcards')
          .then(function(response) {
            return response.data.map(function(card) {
              return {
                cardId: card.id,
                cardName: card.name,
                last4Digits: card.last4,
                creditLimit: card.creditLimit,
                currentBalance: card.balance,
                outstandingAmount: card.outstanding,
                availableCredit: card.creditLimit - card.outstanding,
                cardType: card.type,
                expiryDate: card.expiry
              };
            });
          })
          .catch(function(error) {
            console.error('Error fetching credit cards:', error);
            return $q.reject(error);
          });
      }
    }]);
})();