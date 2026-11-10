(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', TransactionListController);
  TransactionListController.$inject = ['$scope', 'TransactionService', 'CreditCardService', 'PaginationService'];
  function TransactionListController($scope, TransactionService, CreditCardService, PaginationService) {
    var vm = this;
    vm.transactions = [];
    vm.cards = [];
    vm.selectedCard = null;
    vm.filters = {};
    vm.paginationState = PaginationService.createState(1, 50, 0);
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      CreditCardService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loadTransactions();
      }).catch(function(error) {
        vm.error = 'Failed to load credit cards';
        vm.loading = false;
      });
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions(vm.selectedCard, vm.paginationState.currentPage, vm.paginationState.pageSize, vm.filters)
        .then(function(data) {
          vm.transactions = data.transactions || [];
          vm.paginationState = PaginationService.updateState(vm.paginationState, data.totalRecords || 0);
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load transactions';
          vm.loading = false;
        });
    };
    vm.onCardFilterChange = function() {
      vm.paginationState.currentPage = 1;
      vm.loadTransactions();
    };
    vm.nextPage = function() {
      PaginationService.nextPage(vm.paginationState);
      vm.loadTransactions();
    };
    vm.prevPage = function() {
      PaginationService.prevPage(vm.paginationState);
      vm.loadTransactions();
    };
    vm.goToPage = function(page) {
      PaginationService.goToPage(vm.paginationState, page);
      vm.loadTransactions();
    };
    vm.applyFilters = function() {
      vm.paginationState.currentPage = 1;
      vm.loadTransactions();
    };
    vm.clearFilters = function() {
      vm.filters = {};
      vm.selectedCard = null;
      vm.paginationState.currentPage = 1;
      vm.loadTransactions();
    };
    vm.init();
  }
})();