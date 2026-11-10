(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$filter', 'CardDataService', 'TransactionService', function($scope, $filter, CardDataService, TransactionService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.cards = [];
      vm.filteredCards = [];
      vm.selectedCard = null;
      vm.selectedCardAnalysis = null;
      vm.searchText = '';
      vm.init = function() {
        vm.loadCards();
      };
      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        CardDataService.getUserCards('user-123')
          .then(function(cards) {
            vm.cards = cards;
            vm.filteredCards = cards;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.selectCard = function(card) {
        vm.selectedCard = card;
        vm.loadCardAnalysis(card.cardId);
      };
      vm.loadCardAnalysis = function(cardId) {
        TransactionService.getCardSpendAnalysis(cardId)
          .then(function(analysis) {
            vm.selectedCardAnalysis = analysis;
            $scope.$apply();
          })
          .catch(function(error) {
            console.error('Failed to load card analysis', error);
          });
      };
      vm.filterCards = function() {
        if (!vm.searchText) {
          vm.filteredCards = vm.cards;
        } else {
          vm.filteredCards = $filter('filter')(vm.cards, vm.searchText);
        }
      };
      vm.isSelected = function(card) {
        return vm.selectedCard && vm.selectedCard.cardId === card.cardId;
      };
      vm.init();
    }]);
})();