(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', ['$scope', '$routeParams', 'TransactionService', 'CardMappingService', function($scope, $routeParams, TransactionService, CardMappingService) {
    var vm = this;
    vm.loading = true;
    vm.transaction = null;
    vm.error = null;
    var transactionId = $routeParams.transactionId;
    TransactionService.getTransactionById(transactionId).then(function(transaction) {
      return CardMappingService.enrichWithCardDetails([transaction]);
    }).then(function(enrichedTransactions) {
      vm.transaction = enrichedTransactions[0];
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load transaction details. Please try again.';
      vm.loading = false;
    });
  }]);
})();