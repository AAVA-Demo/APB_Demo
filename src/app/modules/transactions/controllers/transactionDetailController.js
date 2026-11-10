(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', ['TransactionService', '$routeParams', '$scope', '$location', function(TransactionService, $routeParams, $scope, $location) {
    var vm = this;
    vm.transaction = null;
    vm.loading = true;
    vm.error = null;
    vm.goBack = goBack;
    
    function loadTransactionDetail() {
      vm.loading = true;
      vm.error = null;
      var transactionId = $routeParams.id;
      TransactionService.getTransactionDetail(transactionId).then(function(transaction) {
        vm.transaction = transaction;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transaction details. Please try again.';
        vm.loading = false;
      });
    }
    
    function goBack() {
      $location.path('/transactions');
    }
    
    loadTransactionDetail();
  }]);
})();