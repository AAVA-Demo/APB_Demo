(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionModel', [function() {
      function TransactionModel(data) {
        this.id = data.id || '';
        this.userId = data.userId || '';
        this.cardId = data.cardId || '';
        this.amount = data.amount || 0;
        this.category = data.category || 'Miscellaneous';
        this.date = data.date ? new Date(data.date) : new Date();
        this.description = data.description || '';
      }
      return TransactionModel;
    }]);
})();