(function() {
  'use strict';
  angular.module('transaction')
    .controller('TransactionDetailController', ['$scope', '$routeParams', '$location', 'TransactionService', function($scope, $routeParams, $location, TransactionService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.transaction = null;
      vm.init = function() {
        const transactionId = $routeParams.id;
        TransactionService.getTransactionDetail(transactionId)
          .then(function(transaction) {
            vm.transaction = transaction;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load transaction details';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.goBack = function() {
        $location.path('/transactions');
      };
      vm.init();
    }]);
})();