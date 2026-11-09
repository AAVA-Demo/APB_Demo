(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$routeParams', '$location', 'CreditCardService', 'TransactionService', function($scope, $routeParams, $location, CreditCardService, TransactionService) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.transactions = [];
      vm.loading = true;
      vm.error = null;
      vm.selectCard = selectCard;
      vm.filterTransactions = filterTransactions;
      vm.sortTransactions = sortTransactions;
      vm.filters = { category: '', dateFrom: null, dateTo: null };
      vm.sortField = 'transactionDate';
      vm.sortReverse = true;

      function loadCards() {
        vm.loading = true;
        CreditCardService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
            if ($routeParams.cardId) {
              selectCard($routeParams.cardId);
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards.';
            vm.loading = false;
          });
      }

      function selectCard(cardId) {
        vm.loading = true;
        CreditCardService.getCardDetails(cardId)
          .then(function(card) {
            vm.selectedCard = card;
            return TransactionService.getTransactionsByCard(cardId);
          })
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.filteredTransactions = transactions;
            vm.loading = false;
            $location.path('/cards/' + cardId);
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details.';
            vm.loading = false;
          });
      }

      function filterTransactions() {
        vm.filteredTransactions = vm.transactions.filter(function(txn) {
          var match = true;
          if (vm.filters.category && txn.category !== vm.filters.category) {
            match = false;
          }
          if (vm.filters.dateFrom && new Date(txn.transactionDate) < new Date(vm.filters.dateFrom)) {
            match = false;
          }
          if (vm.filters.dateTo && new Date(txn.transactionDate) > new Date(vm.filters.dateTo)) {
            match = false;
          }
          return match;
        });
      }

      function sortTransactions(field) {
        if (vm.sortField === field) {
          vm.sortReverse = !vm.sortReverse;
        } else {
          vm.sortField = field;
          vm.sortReverse = false;
        }
      }

      loadCards();
    }]);
})();