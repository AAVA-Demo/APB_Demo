(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionModel', [function() {
    function Transaction(data) {
      this.transactionId = data.transactionId || '';
      this.userId = data.userId || '';
      this.cardId = data.cardId || '';
      this.amount = data.amount || 0;
      this.category = data.category || '';
      this.date = data.date || new Date();
      this.description = data.description || '';
    }
    
    Transaction.prototype.getFormattedAmount = function() {
      return '$' + this.amount.toFixed(2);
    };
    
    return Transaction;
  }]);
})();