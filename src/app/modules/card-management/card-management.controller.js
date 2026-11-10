(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['CardDataFactory', 'TransactionProcessingService', 'AuthService', '$scope', '$state', '$stateParams', CardManagementController]);
  function CardManagementController(CardDataFactory, TransactionProcessingService, AuthService, $scope, $state, $stateParams) {
    var vm = this;
    vm.cards = [];
    vm.selectedCard = null;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.viewCardDetail = viewCardDetail;
    vm.sortBy = 'date';
    vm.filterCategory = '';
    activate();
    function activate() {
      if (!AuthService.isAuthenticated()) {
        vm.error = 'Please log in to view your cards.';
        vm.loading = false;
        return;
      }
      if ($stateParams.cardId) {
        loadCardDetail($stateParams.cardId);
      } else {
        loadCards();
      }
    }
    function loadCards() {
      vm.loading = true;
      CardDataFactory.getAllCards()
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load credit cards. Please try again.';
          vm.loading = false;
        });
    }
    function loadCardDetail(cardId) {
      vm.loading = true;
      CardDataFactory.getCardById(cardId)
        .then(function(card) {
          vm.selectedCard = card;
          return TransactionProcessingService.getCardTransactions(cardId);
        })
        .then(function(transactions) {
          vm.transactions = transactions;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
    }
    function viewCardDetail(cardId) {
      $state.go('card-detail', {cardId: cardId});
    }
  }
})();