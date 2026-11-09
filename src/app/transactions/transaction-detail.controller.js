(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', ['TransactionService', '$routeParams', '$scope', function(TransactionService, $routeParams, $scope) {
    const vm = this;
    vm.transaction = null;
    vm.loading = true;
    vm.error = null;
    const transactionId = $routeParams.transactionId;
    TransactionService.getTransactionById(transactionId).then(function(transaction) {
      vm.transaction = transaction;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load transaction details';
      vm.loading = false;
    });
  }]);
})();