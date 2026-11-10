(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .controller('TransactionListController', ['$scope', 'TransactionService', 'TransactionFilterFactory', 'CreditCardDataService', function($scope, TransactionService, TransactionFilterFactory, CreditCardDataService) {
      var vm = this;
      vm.transactions = [];
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.totalCount = 0;
      vm.currentPage = 1;
      vm.pageSize = 50;
      vm.selectedCardId = null;
      vm.loadTransactions = function() {
        vm.loading = true;
        vm.error = null;
        var filters = TransactionFilterFactory.getFilters();
        filters.page = vm.currentPage;
        filters.cardId = vm.selectedCardId;
        TransactionService.getTransactions(filters)
          .then(function(data) {
            vm.transactions = data.transactions || [];
            vm.totalCount = data.totalCount || 0;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions. Please try again.';
            vm.loading = false;
          });
      };
      vm.loadCards = function() {
        CreditCardDataService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
          })
          .catch(function(error) {
            console.error('Error loading cards:', error);
          });
      };
      vm.filterByCard = function() {
        TransactionFilterFactory.setFilter('cardId', vm.selectedCardId);
        vm.currentPage = 1;
        vm.loadTransactions();
      };
      vm.nextPage = function() {
        if (vm.currentPage * vm.pageSize < vm.totalCount) {
          vm.currentPage++;
          vm.loadTransactions();
        }
      };
      vm.prevPage = function() {
        if (vm.currentPage > 1) {
          vm.currentPage--;
          vm.loadTransactions();
        }
      };
      vm.loadCards();
      vm.loadTransactions();
    }]);
})();