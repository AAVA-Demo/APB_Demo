(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CardModel', [function() {
      function CardModel(data) {
        this.cardId = data.cardId || '';
        this.userId = data.userId || '';
        this.cardName = data.cardName || '';
        this.cardType = data.cardType || '';
        this.creditLimit = data.creditLimit || 0;
        this.outstandingAmount = data.outstandingAmount || 0;
        this.availableCredit = data.availableCredit || 0;
        this.lastFourDigits = data.lastFourDigits || '';
        this.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
      }
      return CardModel;
    }]);
})();