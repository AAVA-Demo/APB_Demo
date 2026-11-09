(function() {
  'use strict';
  angular.module('creditCardApp').controller('cardManagementController', ['$scope', '$routeParams', 'cardManagementService', 'cardAnalyticsService', function($scope, $routeParams, cardManagementService, cardAnalyticsService) {
    var vm = this;
    vm.cards = [];
    vm.selectedCard = null;
    vm.selectedCardAnalysis = null;
    vm.loading = true;
    vm.errorMessage = null;
    vm.filterText = '';
    function loadCards() {
      vm.loading = true;
      cardManagementService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
        if ($routeParams.cardId) {
          vm.selectCard($routeParams.cardId);
        }
      }).catch(function(error) {
        vm.errorMessage = 'Failed to load credit cards. Please try again.';
        vm.loading = false;
      });
    }
    vm.selectCard = function(cardId) {
      vm.selectedCard = vm.cards.find(function(card) { return card.cardId === cardId; });
      if (vm.selectedCard) {
        cardAnalyticsService.getCardSpendAnalysis(cardId).then(function(analysis) {
          vm.selectedCardAnalysis = analysis;
        }).catch(function(error) {
          vm.errorMessage = 'Failed to load card analysis.';
        });
      }
    };
    vm.filterCards = function(card) {
      if (!vm.filterText) return true;
      var searchText = vm.filterText.toLowerCase();
      return card.cardNumber.toLowerCase().includes(searchText) || card.cardType.toLowerCase().includes(searchText) || card.issuerName.toLowerCase().includes(searchText);
    };
    loadCards();
  }]);
})();