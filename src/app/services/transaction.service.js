(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['TransactionApiService', 'CategorizationService', '$q', function(TransactionApiService, CategorizationService, $q) {
    this.getTransactions = function(cardId) {
      return TransactionApiService.fetchTransactions(cardId).then(function(transactions) {
        return CategorizationService.categorize(transactions);
      });
    };
  }]);
})();