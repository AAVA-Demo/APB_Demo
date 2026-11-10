(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardManagementController', ['$scope', 'CardService', 'SpendingAnalysisService', 'CardComparatorFactory', function($scope, CardService, SpendingAnalysisService, CardComparatorFactory) {
      var vm = this;
      vm.cards = [];
      vm.rankedCards = [];
      vm.selectedCards = [];
      vm.comparisonData = [];
      vm.loading = true;
      vm.error = null;
      vm.showComparison = false;
      function loadCardData() {
        vm.loading = true;
        CardService.getMockCards().then(function(cards) {
          vm.cards = cards;
          return SpendingAnalysisService.getMockCardWiseSpending();
        }).then(function(spendingData) {
          vm.rankedCards = CardComparatorFactory.rankCards(vm.cards, spendingData);
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load card data';
          vm.loading = false;
        });
      }
      loadCardData();
      vm.toggleCardSelection = function(card) {
        var index = vm.selectedCards.findIndex(function(c) { return c.cardId === card.cardId; });
        if (index > -1) {
          vm.selectedCards.splice(index, 1);
        } else {
          vm.selectedCards.push(card);
        }
      };
      vm.isCardSelected = function(card) {
        return vm.selectedCards.some(function(c) { return c.cardId === card.cardId; });
      };
      vm.compareSelectedCards = function() {
        if (vm.selectedCards.length < 2) {
          alert('Please select at least 2 cards to compare');
          return;
        }
        vm.comparisonData = CardComparatorFactory.compareCards(vm.selectedCards);
        vm.showComparison = true;
      };
      vm.clearComparison = function() {
        vm.selectedCards = [];
        vm.comparisonData = [];
        vm.showComparison = false;
      };
      vm.getUtilizationClass = function(utilization) {
        if (utilization >= 80) return 'danger';
        if (utilization >= 50) return 'warning';
        return '';
      };
    }]);
})();