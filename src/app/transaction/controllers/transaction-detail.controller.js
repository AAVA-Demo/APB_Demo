(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionDetailController', TransactionDetailController);
  TransactionDetailController.$inject = ['$scope', '$routeParams', '$location', 'TransactionService'];
  function TransactionDetailController($scope, $routeParams, $location, TransactionService) {
    var vm = this;
    vm.transaction = null;
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      var transactionId = $routeParams.transactionId;
      if (!transactionId) {
        vm.error = 'Transaction ID not provided';
        vm.loading = false;
        return;
      }
      TransactionService.getTransactionDetail(transactionId).then(function(data) {
        vm.transaction = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transaction details';
        vm.loading = false;
      });
    };
    vm.goBack = function() {
      $location.path('/transactions');
    };
    vm.init();
  }
})();