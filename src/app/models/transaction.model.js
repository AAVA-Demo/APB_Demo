(function() {
  'use strict';
  angular.module('creditCardApp').factory('Transaction', [function() {
    function Transaction(data) {
      this.id = data.id;
      this.cardId = data.cardId;
      this.date = new Date(data.date);
      this.merchant = data.merchant;
      this.amount = data.amount;
      this.category = data.category;
      this.status = data.status;
      this.description = data.description;
    }
    return Transaction;
  }]);
})();