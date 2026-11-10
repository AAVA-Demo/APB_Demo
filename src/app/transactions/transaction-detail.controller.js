(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionDetailController', TransactionDetailController);
  TransactionDetailController.$inject = ['$scope', '$routeParams', '$location', 'TransactionService'];
  function TransactionDetailController($scope, $routeParams, $location, TransactionService) {
    var vm = this;
    vm.transaction = null;
    vm.loading = true;
    vm.error = null;
    vm.goBack = goBack;
    activate();
    function activate() {
      var transactionId = $routeParams.transactionId;
      if (!transactionId) {
        vm.error = 'Transaction ID not provided.';
        vm.loading = false;
        return;
      }
      TransactionService.getTransactionById(transactionId)
        .then(function(transaction) {
          vm.transaction = transaction;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load transaction details.';
          vm.loading = false;
        });
    }
    function goBack() {
      $location.path('/transactions');
    }
  }
})();