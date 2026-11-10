(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .factory('CreditCardFactory', [function() {
      function create(data) {
        var card = {
          cardId: data.cardId,
          cardNumber: data.cardNumber,
          cardType: data.cardType,
          cardHolderName: data.cardHolderName,
          creditLimit: data.creditLimit,
          outstandingAmount: data.outstandingAmount,
          availableCredit: data.creditLimit - data.outstandingAmount,
          monthlySpend: data.monthlySpend,
          expiryDate: data.expiryDate
        };
        return card;
      }
      return {
        create: create
      };
    }]);
})();