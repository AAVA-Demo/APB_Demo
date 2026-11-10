(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', ['$scope', 'TransactionService', 'CardMappingService', 'SearchFilterService', function($scope, TransactionService, CardMappingService, SearchFilterService) {
    var vm = this;
    vm.loading = true;
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.pagination = { currentPage: 1, pageSize: 20, totalRecords: 0, totalPages: 0 };
    vm.searchText = '';
    vm.error = null;
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.pagination.currentPage, vm.pagination.pageSize).then(function(response) {
        vm.transactions = response.transactions || [];
        vm.pagination.totalRecords = response.totalRecords || 0;
        vm.pagination.totalPages = Math.ceil(vm.pagination.totalRecords / vm.pagination.pageSize);
        return CardMappingService.enrichWithCardDetails(vm.transactions);
      }).then(function(enrichedTransactions) {
        vm.transactions = enrichedTransactions;
        vm.applyFilters();
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions. Please try again.';
        vm.loading = false;
      });
    };
    vm.applyFilters = function() {
      var filterStartTime = Date.now();
      SearchFilterService.setSearchText(vm.searchText);
      vm.filteredTransactions = SearchFilterService.applyFilters(vm.transactions);
      var filterTime = Date.now() - filterStartTime;
      if (filterTime > 500) {
        console.warn('Filter operation exceeded 500ms: ' + filterTime + 'ms');
      }
    };
    vm.nextPage = function() {
      if (vm.pagination.currentPage < vm.pagination.totalPages) {
        vm.pagination.currentPage++;
        vm.loadTransactions();
      }
    };
    vm.prevPage = function() {
      if (vm.pagination.currentPage > 1) {
        vm.pagination.currentPage--;
        vm.loadTransactions();
      }
    };
    vm.loadTransactions();
  }]);
})();