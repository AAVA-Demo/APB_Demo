(function() {
  'use strict';
  window.CardModel = class CardModel {
    constructor(data) {
      this.cardId = data.cardId || '';
      this.cardNumber = data.cardNumber || '';
      this.cardType = data.cardType || '';
      this.creditLimit = data.creditLimit || 0;
      this.availableCredit = data.availableCredit || 0;
      this.outstandingBalance = data.outstandingBalance || 0;
      this.monthlySpend = data.monthlySpend || 0;
      this.expiryDate = data.expiryDate || '';
      this.isActive = data.isActive !== undefined ? data.isActive : true;
    }
  };
})();