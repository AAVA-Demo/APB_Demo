(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionController', ['$scope', 'TransactionService', 'FilterService', function($scope, TransactionService, FilterService) {
      var vm = this;
      vm.transactions = [];
      vm.pagination = {
        currentPage: 1,
        pageSize: 20,
        totalRecords: 0,
        hasMore: true
      };
      vm.filters = FilterService.getFilters();
      vm.loading = false;
      vm.error = null;
      function loadTransactions(append) {
        if (vm.loading) return;
        vm.loading = true;
        vm.error = null;
        TransactionService.getTransactions(vm.pagination.currentPage, vm.pagination.pageSize, vm.filters)
          .then(function(response) {
            if (append) {
              vm.transactions = vm.transactions.concat(response.transactions || []);
            } else {
              vm.transactions = response.transactions || [];
            }
            vm.pagination.totalRecords = response.total || 0;
            vm.pagination.hasMore = vm.transactions.length < vm.pagination.totalRecords;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
            console.error(error);
          });
      }
      vm.applyFilters = function() {
        FilterService.setFilters(vm.filters);
        TransactionService.clearCache();
        vm.pagination.currentPage = 1;
        vm.transactions = [];
        loadTransactions(false);
      };
      vm.resetFilters = function() {
        FilterService.resetFilters();
        vm.filters = FilterService.getFilters();
        TransactionService.clearCache();
        vm.pagination.currentPage = 1;
        vm.transactions = [];
        loadTransactions(false);
      };
      vm.loadMore = function() {
        if (vm.pagination.hasMore && !vm.loading) {
          vm.pagination.currentPage++;
          loadTransactions(true);
        }
      };
      loadTransactions(false);
    }]);
  TransactionController.$inject = ['$scope', 'TransactionService', 'FilterService'];
})();