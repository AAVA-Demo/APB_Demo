(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardManagementController', ['CardService', 'UserProfileService', 'CardComparisonService', '$scope', '$location', CardManagementController]);
  function CardManagementController(CardService, UserProfileService, CardComparisonService, $scope, $location) {
    const vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.showComparison = false;
    vm.selectedCards = [];
    vm.comparisonData = null;
    vm.viewCardDetails = viewCardDetails;
    vm.toggleCardSelection = toggleCardSelection;
    vm.compareCards = compareCards;
    vm.cancelComparison = cancelComparison;
    init();
    function init() {
      UserProfileService.validateUser()
        .then(function() {
          return loadCards();
        })
        .catch(function(error) {
          vm.error = 'User validation failed. Please login again.';
          vm.loading = false;
        });
    }
    function loadCards() {
      vm.loading = true;
      return CardService.fetchUserCards()
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load cards. Please try again.';
          vm.loading = false;
        });
    }
    function viewCardDetails(cardId) {
      $location.path('/cards/' + cardId);
    }
    function toggleCardSelection(card) {
      const index = vm.selectedCards.indexOf(card);
      if (index > -1) {
        vm.selectedCards.splice(index, 1);
      } else {
        vm.selectedCards.push(card);
      }
    }
    function compareCards() {
      if (vm.selectedCards.length < 2) {
        alert('Please select at least 2 cards to compare');
        return;
      }
      vm.comparisonData = CardComparisonService.compareCards(vm.selectedCards);
      vm.showComparison = true;
    }
    function cancelComparison() {
      vm.showComparison = false;
      vm.selectedCards = [];
      vm.comparisonData = null;
    }
  }
})();