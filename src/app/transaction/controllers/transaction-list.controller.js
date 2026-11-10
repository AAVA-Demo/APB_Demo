(function() {
  'use strict';
  angular.module('creditCardApp.transaction')
    .controller('TransactionListController', ['$scope', '$location', 'TransactionService', 'CardManagementService', 'SearchFilterService', TransactionListController]);

  function TransactionListController($scope, $location, TransactionService, CardManagementService, SearchFilterService) {
    var vm = this;
    vm.transactions = [];
    vm.pagination = {};
    vm.loading = true;
    vm.error = null;
    vm.filters = {
      searchTerm: '',
      startDate: null,
      endDate: null,
      cardId: null
    };
    vm.currentPage = 1;
    vm.pageSize = 50;
    vm.cardIds = [];
    vm.applyFilters = applyFilters;
    vm.clearFilters = clearFilters;
    vm.pageChanged = pageChanged;
    vm.viewDetails = viewDetails;

    activate();

    function activate() {
      loadUserCards();
    }

    function loadUserCards() {
      CardManagementService.getUserCards()
        .then(function(cardIds) {
          vm.cardIds = cardIds;
          loadTransactions();
        })
        .catch(function(error) {
          vm.error = 'Failed to load card information.';
          vm.loading = false;
        });
    }

    function loadTransactions() {
      vm.loading = true;
      vm.error = null;
      var filterParams = SearchFilterService.buildQueryParams(vm.filters);
      TransactionService.getTransactions(vm.cardIds, vm.currentPage, vm.pageSize, filterParams)
        .then(function(data) {
          vm.transactions = data.transactions;
          vm.pagination = data.pagination;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
        });
    }

    function applyFilters() {
      vm.currentPage = 1;
      loadTransactions();
    }

    function clearFilters() {
      vm.filters = {
        searchTerm: '',
        startDate: null,
        endDate: null,
        cardId: null
      };
      applyFilters();
    }

    function pageChanged() {
      loadTransactions();
    }

    function viewDetails(transactionId) {
      $location.path('/transactions/' + transactionId);
    }
  }
  TransactionListController.$inject = ['$scope', '$location', 'TransactionService', 'CardManagementService', 'SearchFilterService'];
})();