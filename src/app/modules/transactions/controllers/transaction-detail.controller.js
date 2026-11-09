(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionDetailController', ['$scope', '$routeParams', '$location', 'TransactionService', function($scope, $routeParams, $location, TransactionService) {
      var vm = this;
      vm.transaction = null;
      vm.loading = true;
      vm.error = null;
      vm.loadTransaction = function() {
        vm.loading = true;
        vm.error = null;
        var transactionId = $routeParams.transactionId;
        TransactionService.getTransactionById(transactionId)
          .then(function(transaction) {
            vm.transaction = transaction;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction details. Please try again.';
            vm.loading = false;
          });
      };
      vm.goBack = function() {
        $location.path('/transactions');
      };
      vm.loadTransaction();
    }]);
})();