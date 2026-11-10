(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .controller('TransactionDetailController', ['$scope', '$routeParams', 'TransactionService', function($scope, $routeParams, TransactionService) {
      var vm = this;
      vm.transaction = null;
      vm.loading = true;
      vm.error = null;
      vm.loadTransaction = function() {
        vm.loading = true;
        vm.error = null;
        var transactionId = $routeParams.transactionId;
        TransactionService.getTransactionById(transactionId)
          .then(function(data) {
            vm.transaction = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction details. Please try again.';
            vm.loading = false;
          });
      };
      vm.loadTransaction();
    }]);
})();