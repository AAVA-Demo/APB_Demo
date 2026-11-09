(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('TransactionService', ['$q', 'TransactionApiService', function($q, TransactionApiService) {
      this.getTransactionsByCard = function(cardId) {
        return TransactionApiService.fetchTransactions('user123', null, null, cardId);
      };
    }]);
})();