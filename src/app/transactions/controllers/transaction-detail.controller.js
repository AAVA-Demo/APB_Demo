(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .controller('TransactionDetailController', ['$scope', '$routeParams', '$location', 'TransactionManagementService', function($scope, $routeParams, $location, TransactionManagementService) {
      const vm = this;
      vm.transaction = null;
      vm.loading = true;
      const transactionId = $routeParams.transactionId;
      TransactionManagementService.getTransactionById(transactionId)
        .then(function(transaction) {
          vm.transaction = transaction;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.loading = false;
          toastr.error('Failed to load transaction details');
          $location.path('/transactions');
        });
      vm.goBack = function() {
        $location.path('/transactions');
      };
    }]);
})();