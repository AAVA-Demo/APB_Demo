(function() {
  'use strict';
  angular.module('transaction')
    .controller('TransactionListController', ['$scope', '$location', 'TransactionService', 'SearchFilterFactory', function($scope, $location, TransactionService, SearchFilterFactory) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.transactions = [];
      vm.totalCount = 0;
      vm.pageNumber = 1;
      vm.pageSize = 20;
      vm.hasMore = false;
      vm.filters = SearchFilterFactory.createEmptyFilter();
      vm.init = function() {
        vm.loadTransactions();
      };
      vm.loadTransactions = function() {
        vm.loading = true;
        TransactionService.getTransactions(vm.pageNumber, vm.pageSize, vm.filters)
          .then(function(response) {
            vm.transactions = response.transactions;
            vm.totalCount = response.totalCount;
            vm.hasMore = response.hasMore;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.applyFilter = function() {
        vm.pageNumber = 1;
        vm.loadTransactions();
      };
      vm.clearFilters = function() {
        vm.filters = SearchFilterFactory.createEmptyFilter();
        vm.applyFilter();
      };
      vm.viewDetail = function(transactionId) {
        $location.path('/transactions/' + transactionId);
      };
      vm.nextPage = function() {
        if (vm.hasMore) {
          vm.pageNumber++;
          vm.loadTransactions();
        }
      };
      vm.prevPage = function() {
        if (vm.pageNumber > 1) {
          vm.pageNumber--;
          vm.loadTransactions();
        }
      };
      vm.init();
    }]);
})();