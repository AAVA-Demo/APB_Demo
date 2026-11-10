(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', ['TransactionService', 'SearchFilterService', 'PaginationFactory', '$scope', '$location', function(TransactionService, SearchFilterService, PaginationFactory, $scope, $location) {
    var vm = this;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.filters = {
      cardIds: [],
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      categories: [],
      merchantName: ''
    };
    vm.pagination = PaginationFactory.create();
    vm.applyFilters = applyFilters;
    vm.clearFilters = clearFilters;
    vm.goToPage = goToPage;
    vm.viewDetail = viewDetail;
    
    function loadTransactions() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      var queryParams = SearchFilterService.buildQuery(vm.filters, vm.pagination.currentPage, vm.pagination.pageSize);
      TransactionService.getTransactions(userId, queryParams).then(function(response) {
        vm.transactions = response.transactions;
        vm.pagination.totalCount = response.totalCount;
        vm.pagination.totalPages = Math.ceil(response.totalCount / vm.pagination.pageSize);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions. Please try again.';
        vm.loading = false;
      });
    }
    
    function applyFilters() {
      vm.pagination.currentPage = 1;
      loadTransactions();
    }
    
    function clearFilters() {
      vm.filters = {
        cardIds: [],
        startDate: null,
        endDate: null,
        minAmount: null,
        maxAmount: null,
        categories: [],
        merchantName: ''
      };
      applyFilters();
    }
    
    function goToPage(page) {
      if (page >= 1 && page <= vm.pagination.totalPages) {
        vm.pagination.currentPage = page;
        loadTransactions();
      }
    }
    
    function viewDetail(transactionId) {
      $location.path('/transactions/' + transactionId);
    }
    
    loadTransactions();
  }]);
})();