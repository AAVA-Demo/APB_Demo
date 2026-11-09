(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionListController', ['$scope', '$location', 'TransactionService', 'SearchFilterService', function($scope, $location, TransactionService, SearchFilterService) {
      const vm = this;
      vm.transactions = [];
      vm.filteredTransactions = [];
      vm.loading = true;
      vm.error = null;
      vm.pagination = {
        currentPage: 1,
        pageSize: 50,
        totalRecords: 0,
        totalPages: 0
      };
      vm.filters = {
        searchTerm: '',
        cardId: '',
        dateFrom: null,
        dateTo: null,
        category: ''
      };
      
      vm.loadTransactions = function() {
        vm.loading = true;
        TransactionService.getTransactions(vm.pagination.currentPage, vm.pagination.pageSize, vm.filters)
          .then(function(response) {
            vm.transactions = response.transactions;
            vm.filteredTransactions = response.transactions;
            vm.pagination.totalRecords = response.totalCount;
            vm.pagination.totalPages = Math.ceil(response.totalCount / vm.pagination.pageSize);
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
            console.error('Transaction load error:', error);
            $scope.$apply();
          });
      };
      
      vm.applyFilters = function() {
        vm.filteredTransactions = SearchFilterService.applyFilters(vm.transactions, vm.filters);
      };
      
      vm.changePage = function(page) {
        vm.pagination.currentPage = page;
        vm.loadTransactions();
      };
      
      vm.viewDetail = function(transactionId) {
        $location.path('/transactions/' + transactionId);
      };
      
      vm.loadTransactions();
    }]);
})();