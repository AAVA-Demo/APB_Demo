(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$state', '$stateParams', 'CardService', 'UserProfileFactory', function($scope, $state, $stateParams, CardService, UserProfileFactory) {
      var vm = this;
      vm.cards = [];
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.loadCards = function() {
        vm.loading = true;
        UserProfileFactory.getUserProfile()
          .then(function(profile) {
            return CardService.getAllCards(profile.cardIds);
          })
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
            if ($stateParams.cardId) {
              vm.selectCard($stateParams.cardId);
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load cards. Please try again.';
            vm.loading = false;
          });
      };
      vm.selectCard = function(cardId) {
        CardService.getCardDetails(cardId)
          .then(function(card) {
            vm.selectedCard = card;
            if ($state.current.name === 'cards') {
              $state.go('cardDetail', { cardId: cardId });
            }
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details.';
          });
      };
      vm.backToList = function() {
        vm.selectedCard = null;
        $state.go('cards');
      };
      vm.loadCards();
    }]);
})();