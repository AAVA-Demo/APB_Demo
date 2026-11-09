(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionListController', ['$scope', '$location', 'TransactionService', 'SearchFilterService', function($scope, $location, TransactionService, SearchFilterService) {
      var vm = this;
      vm.transactions = [];
      vm.filters = {
        cardId: '',
        startDate: null,
        endDate: null,
        keyword: '',
        category: ''
      };
      vm.pagination = {
        currentPage: 1,
        pageSize: 50,
        totalRecords: 0,
        totalPages: 0
      };
      vm.loading = false;
      vm.error = null;
      vm.loadTransactions = function() {
        vm.loading = true;
        vm.error = null;
        var filterParams = SearchFilterService.buildFilterParams(vm.filters);
        TransactionService.getTransactions(filterParams, vm.pagination.currentPage, vm.pagination.pageSize)
          .then(function(result) {
            vm.transactions = result.transactions;
            vm.pagination.totalRecords = result.totalCount;
            vm.pagination.totalPages = Math.ceil(result.totalCount / vm.pagination.pageSize);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again.';
            vm.loading = false;
          });
      };
      vm.applyFilters = function() {
        vm.pagination.currentPage = 1;
        vm.loadTransactions();
      };
      vm.clearFilters = function() {
        vm.filters = {
          cardId: '',
          startDate: null,
          endDate: null,
          keyword: '',
          category: ''
        };
        vm.applyFilters();
      };
      vm.viewTransaction = function(transactionId) {
        $location.path('/transactions/' + transactionId);
      };
      vm.goToPage = function(page) {
        if (page >= 1 && page <= vm.pagination.totalPages) {
          vm.pagination.currentPage = page;
          vm.loadTransactions();
        }
      };
      vm.loadTransactions();
    }]);
})();