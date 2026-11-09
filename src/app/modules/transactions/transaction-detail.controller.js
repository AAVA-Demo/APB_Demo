(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionDetailController', ['$scope', '$routeParams', 'TransactionService', function($scope, $routeParams, TransactionService) {
      const vm = this;
      vm.transaction = null;
      vm.loading = true;
      vm.error = null;
      
      vm.init = function() {
        const transactionId = $routeParams.transactionId;
        TransactionService.getTransactionById(transactionId)
          .then(function(transaction) {
            vm.transaction = transaction;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction details';
            vm.loading = false;
            console.error('Transaction detail error:', error);
            $scope.$apply();
          });
      };
      
      vm.init();
    }]);
})();