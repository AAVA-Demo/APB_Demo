(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$state', '$stateParams', 'CardService', 'AuthService', function($scope, $state, $stateParams, CardService, AuthService) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.spendSummary = null;
      vm.loading = true;
      vm.searchText = '';
      function loadCards() {
        vm.loading = true;
        var userId = AuthService.getUserId();
        CardService.getUserCards(userId).then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
          if ($stateParams.cardId) {
            vm.selectCard($stateParams.cardId);
          }
        }).catch(function(error) {
          vm.loading = false;
          alert('Failed to load cards');
        });
      }
      vm.selectCard = function(cardId) {
        vm.selectedCard = vm.cards.find(function(c) { return c.cardId === cardId; });
        if (vm.selectedCard) {
          CardService.getCardSpendSummary(cardId).then(function(summary) {
            vm.spendSummary = summary;
          });
          $state.go('cardDetail', { cardId: cardId });
        }
      };
      vm.backToList = function() {
        vm.selectedCard = null;
        vm.spendSummary = null;
        $state.go('cards');
      };
      loadCards();
    }]);
})();