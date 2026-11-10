(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionListController', TransactionListController);
  TransactionListController.$inject = ['$scope', '$routeParams', '$location', 'TransactionService', 'TransactionFilterService'];
  function TransactionListController($scope, $routeParams, $location, TransactionService, TransactionFilterService) {
    var vm = this;
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.loading = true;
    vm.error = null;
    vm.filter = {
      dateFrom: new Date(new Date().setDate(new Date().getDate() - 30)),
      dateTo: new Date(),
      cardIds: [],
      categories: [],
      searchText: ''
    };
    vm.applyFilter = applyFilter;
    vm.viewDetail = viewDetail;
    activate();
    function activate() {
      if ($routeParams.category) {
        vm.filter.categories = [$routeParams.category];
      }
      loadTransactions();
    }
    function loadTransactions() {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions(vm.filter)
        .then(function(transactions) {
          vm.transactions = transactions;
          vm.filteredTransactions = TransactionFilterService.applyFilters(transactions, vm.filter);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
        });
    }
    function applyFilter() {
      vm.filteredTransactions = TransactionFilterService.applyFilters(vm.transactions, vm.filter);
    }
    function viewDetail(transactionId) {
      $location.path('/transactions/' + transactionId);
    }
  }
})();