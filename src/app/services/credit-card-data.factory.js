(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var mockCards = [
        {cardId: 'CC001', cardNumber: '**** **** **** 1234', cardType: 'Visa', cardHolderName: 'John Doe', expiryDate: '12/25', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, lastSyncTime: new Date()},
        {cardId: 'CC002', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', cardHolderName: 'John Doe', expiryDate: '06/26', creditLimit: 30000, availableCredit: 20000, outstandingAmount: 10000, lastSyncTime: new Date()},
        {cardId: 'CC003', cardNumber: '**** **** **** 9012', cardType: 'Amex', cardHolderName: 'John Doe', expiryDate: '03/27', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, lastSyncTime: new Date()}
      ];
      return {
        fetchAllCards: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            deferred.resolve({data: mockCards});
          }, 500);
          return deferred.promise;
        },
        fetchCards: function() {
          return this.fetchAllCards();
        },
        getCardById: function(cardId) {
          var deferred = $q.defer();
          setTimeout(function() {
            var card = mockCards.find(function(c) { return c.cardId === cardId; });
            if (card) {
              deferred.resolve({data: card});
            } else {
              deferred.reject({error: 'Card not found'});
            }
          }, 300);
          return deferred.promise;
        }
      };
    }]);
})();