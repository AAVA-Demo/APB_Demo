(function() {
  'use strict';
  window.CreditCardModel = class CreditCardModel {
    constructor(data) {
      this.cardId = data.cardId || '';
      this.cardNumber = data.cardNumber || '';
      this.cardholderName = data.cardholderName || '';
      this.issuer = data.issuer || '';
      this.creditLimit = data.creditLimit || 0;
      this.availableCredit = data.availableCredit || 0;
      this.outstandingAmount = data.outstandingAmount || 0;
      this.status = data.status || 'Active';
    }
  };
})();