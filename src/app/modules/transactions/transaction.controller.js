(function() {
  'use strict';
  angular.module('creditCardApp.transactions')
    .controller('TransactionController', ['TransactionService', 'CreditCardService', '$scope', '$routeParams', '$location', TransactionController]);
  function TransactionController(TransactionService, CreditCardService, $scope, $routeParams, $location) {
    var vm = this;
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.filters = {
      searchText: '',
      selectedCard: null,
      startDate: null,
      endDate: null
    };
    vm.currentTransaction = null;
    vm.applyFilters = applyFilters;
    vm.viewDetail = viewDetail;
    vm.backToList = backToList;
    activate();
    function activate() {
      if ($routeParams.id) {
        loadTransactionDetail($routeParams.id);
      } else {
        loadTransactions();
      }
    }
    function loadTransactions() {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions()
        .then(function(transactions) {
          return CreditCardService.getCards()
            .then(function(cards) {
              vm.cards = cards;
              vm.transactions = transactions.map(function(txn) {
                var card = cards.find(function(c) { return c.id === txn.cardId; });
                if (card) {
                  txn.cardName = card.name;
                  txn.cardLastFourDigits = card.lastFourDigits;
                }
                return txn;
              });
              vm.filteredTransactions = vm.transactions;
              vm.loading = false;
            });
        })
        .catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
        });
    }
    function loadTransactionDetail(id) {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions()
        .then(function(transactions) {
          vm.currentTransaction = transactions.find(function(t) { return t.id === id; });
          if (!vm.currentTransaction) {
            vm.error = 'Transaction not found.';
          }
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load transaction detail.';
          vm.loading = false;
        });
    }
    function applyFilters() {
      vm.filteredTransactions = vm.transactions.filter(function(txn) {
        var matchesSearch = true;
        var matchesCard = true;
        var matchesDate = true;
        if (vm.filters.searchText) {
          var search = vm.filters.searchText.toLowerCase();
          matchesSearch = (txn.merchant && txn.merchant.toLowerCase().indexOf(search) !== -1) ||
                         (txn.category && txn.category.toLowerCase().indexOf(search) !== -1);
        }
        if (vm.filters.selectedCard) {
          matchesCard = txn.cardId === vm.filters.selectedCard;
        }
        if (vm.filters.startDate) {
          var txnDate = new Date(txn.date);
          var startDate = new Date(vm.filters.startDate);
          matchesDate = matchesDate && txnDate >= startDate;
        }
        if (vm.filters.endDate) {
          var txnDate = new Date(txn.date);
          var endDate = new Date(vm.filters.endDate);
          matchesDate = matchesDate && txnDate <= endDate;
        }
        return matchesSearch && matchesCard && matchesDate;
      });
    }
    function viewDetail(transactionId) {
      $location.path('/transactions/' + transactionId);
    }
    function backToList() {
      $location.path('/transactions');
    }
    $scope.$watch('vm.filters', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        var timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          $scope.$apply(function() {
            vm.applyFilters();
          });
        }, 300);
      }
    }, true);
  }
})();