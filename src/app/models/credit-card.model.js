(function() {
  'use strict';
  angular.module('app.cardManagement')
    .factory('CreditCardModel', [function() {
      function CreditCardModel(data) {
        this.cardId = data.cardId || '';
        this.cardName = data.cardName || '';
        this.last4Digits = data.last4Digits || '';
        this.creditLimit = data.creditLimit || 0;
        this.currentBalance = data.currentBalance || 0;
        this.outstandingAmount = data.outstandingAmount || 0;
        this.availableCredit = data.availableCredit || 0;
        this.cardType = data.cardType || '';
        this.expiryDate = data.expiryDate || '';
      }
      return CreditCardModel;
    }]);
})();