(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionListController', ['$scope', '$timeout', 'TransactionService', 'SearchFilterService', 'CreditCardService', function($scope, $timeout, TransactionService, SearchFilterService, CreditCardService) {
      var vm = this;
      vm.transactions = [];
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.filters = {
        cardId: null,
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null,
        merchantName: '',
        category: null
      };
      vm.searchText = '';
      var searchTimeout;
      function loadTransactions() {
        vm.loading = true;
        var queryParams = SearchFilterService.constructQueryParams(vm.filters);
        TransactionService.getTransactions(queryParams).then(function(data) {
          vm.transactions = data.transactions || [];
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load transactions';
          vm.loading = false;
        });
      }
      function loadCards() {
        CreditCardService.getUserCards().then(function(cards) {
          vm.cards = cards;
        });
      }
      vm.applyFilters = function() {
        loadTransactions();
      };
      vm.clearFilters = function() {
        vm.filters = {
          cardId: null,
          dateFrom: null,
          dateTo: null,
          minAmount: null,
          maxAmount: null,
          merchantName: '',
          category: null
        };
        vm.searchText = '';
        loadTransactions();
      };
      vm.onSearchChange = function() {
        if (searchTimeout) {
          $timeout.cancel(searchTimeout);
        }
        searchTimeout = $timeout(function() {
          vm.filters.merchantName = vm.searchText;
          loadTransactions();
        }, 500);
      };
      loadCards();
      loadTransactions();
    }]);
})();