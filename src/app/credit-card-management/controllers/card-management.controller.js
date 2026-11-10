(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardManagementController', ['$scope', '$routeParams', '$location', 'CreditCardService', 'TransactionService', 'AuthService', function($scope, $routeParams, $location, CreditCardService, TransactionService, AuthService) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.cardSpending = null;
      vm.comparisonCards = [];
      vm.loading = false;
      vm.error = null;
      vm.selectCard = selectCard;
      vm.addToComparison = addToComparison;
      vm.removeFromComparison = removeFromComparison;
      vm.viewComparison = viewComparison;
      init();
      function init() {
        AuthService.validateSession()
          .then(function() {
            if ($routeParams.cardId) {
              loadCardDetails($routeParams.cardId);
            } else {
              loadCards();
            }
          })
          .catch(function(error) {
            vm.error = 'Authentication failed. Please log in.';
            console.error('Auth error:', error);
          });
      }
      function loadCards() {
        vm.loading = true;
        vm.error = null;
        CreditCardService.getCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
            console.error('Card load error:', error);
          });
      }
      function selectCard(cardId) {
        $location.path('/cards/' + cardId);
      }
      function loadCardDetails(cardId) {
        vm.loading = true;
        vm.error = null;
        CreditCardService.getCardById(cardId)
          .then(function(card) {
            vm.selectedCard = card;
            return TransactionService.getCardSpending(cardId);
          })
          .then(function(spending) {
            vm.cardSpending = spending;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
            console.error('Card details error:', error);
          });
      }
      function addToComparison(card) {
        if (vm.comparisonCards.length >= 4) {
          alert('You can compare up to 4 cards at a time.');
          return;
        }
        if (vm.comparisonCards.findIndex(function(c) { return c.cardId === card.cardId; }) === -1) {
          vm.comparisonCards.push(card);
        }
      }
      function removeFromComparison(cardId) {
        vm.comparisonCards = vm.comparisonCards.filter(function(c) { return c.cardId !== cardId; });
      }
      function viewComparison() {
        if (vm.comparisonCards.length < 2) {
          alert('Please select at least 2 cards to compare.');
          return;
        }
        $location.path('/cards/compare');
      }
    }]);
})();