(function() {
  'use strict';
  angular.module('creditCardApp').factory('CreditCardService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    const API_BASE = '/api/cards';
    const mockCards = [
      {cardId: 'card-1', cardNumber: '**** **** **** 1234', cardHolderName: 'John Doe', cardType: 'Visa', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500, lastTransactionDate: new Date()},
      {cardId: 'card-2', cardNumber: '**** **** **** 5678', cardHolderName: 'John Doe', cardType: 'MasterCard', creditLimit: 15000, currentBalance: 5200, availableCredit: 9800, lastTransactionDate: new Date()},
      {cardId: 'card-3', cardNumber: '**** **** **** 9012', cardHolderName: 'John Doe', cardType: 'Amex', creditLimit: 20000, currentBalance: 8100, availableCredit: 11900, lastTransactionDate: new Date()}
    ];
    return {
      getAllCards: function(userId) {
        const deferred = $q.defer();
        setTimeout(() => {
          deferred.resolve(angular.copy(mockCards));
        }, 300);
        return deferred.promise;
      },
      getCardById: function(cardId) {
        const deferred = $q.defer();
        setTimeout(() => {
          const card = mockCards.find(c => c.cardId === cardId);
          if (card) {
            deferred.resolve(angular.copy(card));
          } else {
            deferred.reject({message: 'Card not found'});
          }
        }, 200);
        return deferred.promise;
      }
    };
  }]);
})();