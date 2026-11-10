(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', TransactionDetailController);
  TransactionDetailController.$inject = ['TransactionService', '$stateParams', '$scope'];
  function TransactionDetailController(TransactionService, $stateParams, $scope) {
    var vm = this;
    vm.transaction = null;
    vm.loading = true;
    vm.error = null;
    activate();
    function activate() {
      var transactionId = $stateParams.id;
      TransactionService.getTransactionDetail(transactionId).then(function(transaction) {
        vm.transaction = transaction;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transaction details';
        vm.loading = false;
      });
    }
  }
})();