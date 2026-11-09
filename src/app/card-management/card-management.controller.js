(function() {
  'use strict';
  angular.module('creditCardApp.cardManagement')
    .controller('CardManagementController', ['CreditCardDataService', 'TransactionService', 'CardComparisonService', 'AuthService', '$scope', function(CreditCardDataService, TransactionService, CardComparisonService, AuthService, $scope) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.cardSpending = null;
      vm.comparisonMode = false;
      vm.selectedForComparison = [];
      vm.comparisonResults = [];
      vm.selectCard = selectCard;
      vm.toggleComparison = toggleComparison;
      vm.compareSelected = compareSelected;

      function init() {
        AuthService.validateSession().then(function(session) {
          loadCards(session.userId);
        });
      }

      function loadCards(userId) {
        CreditCardDataService.getAllCards(userId).then(function(cards) {
          vm.cards = cards;
          if (cards.length > 0) selectCard(cards[0]);
          $scope.$apply();
        });
      }

      function selectCard(card) {
        vm.selectedCard = card;
        TransactionService.getCardSpending(card.cardId).then(function(spending) {
          vm.cardSpending = spending.reduce(function(sum, t) { return sum + t.amount; }, 0);
          $scope.$apply();
        });
      }

      function toggleComparison() {
        vm.comparisonMode = !vm.comparisonMode;
        vm.selectedForComparison = [];
        vm.comparisonResults = [];
      }

      function compareSelected() {
        if (vm.selectedForComparison.length < 2) return;
        CardComparisonService.compareCards(vm.selectedForComparison).then(function(results) {
          vm.comparisonResults = results;
          $scope.$apply();
        });
      }

      init();
    }]);
})();