(function() {
  'use strict';
  angular.module('ccApp').factory('Transaction', [function() {
    function Transaction(data) {
      this.id = data.id || '';
      this.cardId = data.cardId || '';
      this.date = data.date ? new Date(data.date) : new Date();
      this.merchant = data.merchant || '';
      this.amount = data.amount || 0;
      this.currency = data.currency || 'USD';
      this.category = data.category || 'Miscellaneous';
      this.description = data.description || '';
      this.status = data.status || 'posted';
      this.cardLast4 = data.cardLast4 || '';
    }
    Transaction.prototype.isPosted = function() {
      return this.status === 'posted';
    };
    Transaction.prototype.getFormattedAmount = function() {
      return this.currency + ' ' + this.amount.toFixed(2);
    };
    return Transaction;
  }]);
})();