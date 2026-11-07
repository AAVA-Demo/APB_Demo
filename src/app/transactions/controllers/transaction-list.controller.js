(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .controller('TransactionListController', ['$scope', '$location', 'TransactionManagementService', 'AuthService', function($scope, $location, TransactionManagementService, AuthService) {
      const vm = this;
      vm.transactions = [];
      vm.loading = true;
      vm.currentPage = 1;
      vm.pageSize = 100;
      vm.totalCount = 0;
      vm.filters = {};
      const userId = AuthService.getUserId();
      function loadTransactions() {
        vm.loading = true;
        TransactionManagementService.getTransactions(userId, vm.currentPage, vm.pageSize, vm.filters)
          .then(function(data) {
            vm.transactions = data.transactions;
            vm.totalCount = data.totalCount;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load transactions');
          });
      }
      loadTransactions();
      vm.viewDetail = function(transactionId) {
        $location.path('/transactions/' + transactionId);
      };
      vm.applyFilters = function() {
        vm.currentPage = 1;
        loadTransactions();
      };
      vm.clearFilters = function() {
        vm.filters = {};
        vm.currentPage = 1;
        loadTransactions();
      };
      vm.pageChanged = function() {
        loadTransactions();
      };
    }]);
})();