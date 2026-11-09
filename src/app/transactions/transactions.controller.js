(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionController', ['$scope', 'TransactionService', function($scope, TransactionService) {
      var vm = this;
      vm.transactions = [];
      vm.filteredTransactions = [];
      vm.loading = true;
      vm.error = null;
      vm.filters = {
        searchText: '',
        cardId: '',
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null
      };
      vm.cards = [];
      function loadTransactions() {
        vm.loading = true;
        TransactionService.getTransactions()
          .then(function(data) {
            vm.transactions = data.transactions;
            vm.filteredTransactions = vm.transactions;
            vm.cards = extractUniqueCards(vm.transactions);
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
          });
      }
      function extractUniqueCards(transactions) {
        var cardMap = {};
        transactions.forEach(function(t) {
          if (!cardMap[t.cardId]) {
            cardMap[t.cardId] = { cardId: t.cardId, cardNumber: t.cardNumber };
          }
        });
        return Object.values(cardMap);
      }
      vm.applyFilters = function() {
        vm.filteredTransactions = vm.transactions.filter(function(t) {
          var matchSearch = !vm.filters.searchText || 
            t.merchantName.toLowerCase().indexOf(vm.filters.searchText.toLowerCase()) > -1 ||
            t.description.toLowerCase().indexOf(vm.filters.searchText.toLowerCase()) > -1;
          var matchCard = !vm.filters.cardId || t.cardId === vm.filters.cardId;
          var matchDateFrom = !vm.filters.dateFrom || new Date(t.transactionDate) >= new Date(vm.filters.dateFrom);
          var matchDateTo = !vm.filters.dateTo || new Date(t.transactionDate) <= new Date(vm.filters.dateTo);
          var matchMinAmount = !vm.filters.minAmount || t.amount >= parseFloat(vm.filters.minAmount);
          var matchMaxAmount = !vm.filters.maxAmount || t.amount <= parseFloat(vm.filters.maxAmount);
          return matchSearch && matchCard && matchDateFrom && matchDateTo && matchMinAmount && matchMaxAmount;
        });
      };
      vm.clearFilters = function() {
        vm.filters = {
          searchText: '',
          cardId: '',
          dateFrom: null,
          dateTo: null,
          minAmount: null,
          maxAmount: null
        };
        vm.filteredTransactions = vm.transactions;
      };
      loadTransactions();
    }]);
})();