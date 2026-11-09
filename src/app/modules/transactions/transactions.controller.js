(function() {
  'use strict';
  angular.module('creditCard.transactions').controller('TransactionController', ['$scope', '$routeParams', 'TransactionService', function($scope, $routeParams, TransactionService) {
    var vm = this;
    vm.transactions = [];
    vm.selectedTransaction = null;
    vm.loading = true;
    vm.error = null;
    vm.cardId = $routeParams.cardId || null;
    vm.selectTransaction = function(transaction) {
      vm.selectedTransaction = transaction;
    };
    vm.clearSelection = function() {
      vm.selectedTransaction = null;
    };
    function init() {
      TransactionService.getTransactions(vm.cardId).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions. Please try again.';
        vm.loading = false;
      });
    }
    init();
  }]);
})();