(function() {
  'use strict';
  angular.module('app.transactions').controller('TransactionDetailController', ['TransactionService', '$scope', '$stateParams', '$state', function(TransactionService, $scope, $stateParams, $state) {
    var vm = this;
    vm.loading = true;
    vm.transaction = null;
    vm.transactionId = $stateParams.transactionId;
    TransactionService.getTransactionById(vm.transactionId).then(function(txn) {
      vm.transaction = txn;
      vm.loading = false;
    }).catch(function(error) {
      vm.loading = false;
      vm.error = 'Failed to load transaction details';
    });
    vm.goBack = function() {
      $state.go('transactions');
    };
  }]);
})();