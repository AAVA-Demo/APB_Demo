(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardManagementController', ['$scope', '$routeParams', '$filter', 'authService', 'cardInfoService', 'spendAnalysisService', function($scope, $routeParams, $filter, authService, cardInfoService, spendAnalysisService) {
    var vm = this;
    vm.cards = [];
    vm.selectedCard = null;
    vm.selectedCardSpend = null;
    vm.loading = true;
    vm.error = null;
    vm.filterText = '';
    vm.filterType = '';
    vm.init = function() {
      vm.loading = true;
      authService.validateSession().then(function() {
        return cardInfoService.getCards();
      }).then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
        if ($routeParams.cardId) {
          vm.selectCard($routeParams.cardId);
        }
      }).catch(function(error) {
        vm.error = 'Failed to load card information. Please try again.';
        vm.loading = false;
      });
    };
    vm.selectCard = function(cardId) {
      vm.selectedCard = vm.cards.find(function(card) { return card.cardId === cardId; });
      if (vm.selectedCard) {
        spendAnalysisService.getSpendSummary(cardId).then(function(spendData) {
          vm.selectedCardSpend = spendData;
        }).catch(function(error) {
          vm.error = 'Failed to load spend analysis.';
        });
      }
    };
    vm.getFilteredCards = function() {
      var filtered = vm.cards;
      if (vm.filterText) {
        filtered = $filter('filter')(filtered, vm.filterText);
      }
      if (vm.filterType) {
        filtered = filtered.filter(function(card) { return card.cardType === vm.filterType; });
      }
      return filtered;
    };
    vm.init();
  }]);
})();