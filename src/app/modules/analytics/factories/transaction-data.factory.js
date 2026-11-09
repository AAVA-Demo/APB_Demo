(function() {
  'use strict';
  angular.module('creditCard.analytics').factory('TransactionDataFactory', ['$http', '$q', 'AuthService', 'TransactionService', function($http, $q, AuthService, TransactionService) {
    return {
      getTransactions: function(dateRange) {
        return TransactionService.getTransactions(dateRange);
      }
    };
  }]);
})();