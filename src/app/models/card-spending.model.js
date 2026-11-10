(function() {
  'use strict';
  window.CardSpendingModel = class CardSpendingModel {
    constructor(data) {
      this.cardId = data.cardId || '';
      this.monthlySpend = data.monthlySpend || 0;
      this.transactionCount = data.transactionCount || 0;
      this.lastTransactionDate = data.lastTransactionDate || null;
    }
  };
})();