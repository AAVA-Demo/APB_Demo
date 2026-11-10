(function() {
  'use strict';
  angular.module('app.analytics')
    .service('TransactionCategorizationService', ['TransactionDataFactory', TransactionCategorizationService]);
  function TransactionCategorizationService(TransactionDataFactory) {
    var self = this;
    self.getCategorizedTransactions = getCategorizedTransactions;
    function getCategorizedTransactions() {
      return TransactionDataFactory.fetchTransactions({categorized: true});
    }
  }
})();