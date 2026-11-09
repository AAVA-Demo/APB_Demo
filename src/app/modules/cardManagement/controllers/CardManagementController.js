(function() {
  'use strict';
  angular.module('cardManagement.module')
    .controller('CardManagementController', ['$scope', '$routeParams', '$location', 'CardService', 'TransactionService', function($scope, $routeParams, $location, CardService, TransactionService) {
      const vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.transactions = [];
      vm.loading = true;
      vm.error = null;
      vm.isDetailView = false;
      vm.init = function() {
        if ($routeParams.cardId) {
          vm.isDetailView = true;
          vm.loadCardDetail($routeParams.cardId);
        } else {
          vm.isDetailView = false;
          vm.loadCards();
        }
      };
      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        CardService.getCards().then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load credit cards. Please try again.';
          vm.loading = false;
        });
      };
      vm.loadCardDetail = function(cardId) {
        vm.loading = true;
        vm.error = null;
        CardService.getCardById(cardId).then(function(card) {
          vm.selectedCard = card;
          return TransactionService.getTransactions(cardId);
        }).then(function(transactions) {
          vm.transactions = transactions;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
      };
      vm.selectCard = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.backToList = function() {
        $location.path('/cards');
      };
      vm.init();
    }]);
})();