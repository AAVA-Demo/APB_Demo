(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionController', ['$scope', '$routeParams', '$filter', 'TransactionDataService', 'CreditCardService', 'AuthService', function($scope, $routeParams, $filter, TransactionDataService, CreditCardService, AuthService) {
      var vm = this;
      vm.transactions = [];
      vm.filteredTransactions = [];
      vm.cards = [];
      vm.selectedCard = null;
      vm.searchTerm = '';
      vm.dateRange = { start: null, end: null };
      vm.loading = true;
      vm.error = null;
      vm.currentPage = 1;
      vm.pageSize = 20;
      vm.selectedTransaction = null;
      function loadTransactions() {
        var userId = AuthService.getUserId();
        vm.loading = true;
        vm.error = null;
        TransactionDataService.getTransactions(userId)
          .then(function(transactions) {
            vm.transactions = transactions.sort(function(a, b) {
              return new Date(b.transactionDate) - new Date(a.transactionDate);
            });
            vm.filteredTransactions = vm.transactions;
            return CreditCardService.getCards(userId);
          })
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
            if ($routeParams.id) {
              loadTransactionDetail($routeParams.id);
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again.';
            vm.loading = false;
            console.error('Transaction error:', error);
          });
      }
      function loadTransactionDetail(transactionId) {
        TransactionDataService.getTransactionById(transactionId)
          .then(function(transaction) {
            vm.selectedTransaction = transaction;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction details.';
            console.error('Transaction detail error:', error);
          });
      }
      vm.applyFilter = function() {
        vm.filteredTransactions = $filter('transactionFilter')(vm.transactions, {
          cardId: vm.selectedCard,
          searchTerm: vm.searchTerm,
          dateRange: vm.dateRange
        });
        vm.currentPage = 1;
      };
      vm.clearFilters = function() {
        vm.selectedCard = null;
        vm.searchTerm = '';
        vm.dateRange = { start: null, end: null };
        vm.filteredTransactions = vm.transactions;
        vm.currentPage = 1;
      };
      vm.getPaginatedTransactions = function() {
        var start = (vm.currentPage - 1) * vm.pageSize;
        var end = start + vm.pageSize;
        return vm.filteredTransactions.slice(start, end);
      };
      vm.getTotalPages = function() {
        return Math.ceil(vm.filteredTransactions.length / vm.pageSize);
      };
      vm.nextPage = function() {
        if (vm.currentPage < vm.getTotalPages()) {
          vm.currentPage++;
        }
      };
      vm.prevPage = function() {
        if (vm.currentPage > 1) {
          vm.currentPage--;
        }
      };
      loadTransactions();
    }]);
})();