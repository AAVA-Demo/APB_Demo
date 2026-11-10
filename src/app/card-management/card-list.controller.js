(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', CardListController);
  CardListController.$inject = ['CardService', 'UserProfileService', '$scope', '$state'];
  function CardListController(CardService, UserProfileService, $scope, $state) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectCard = selectCard;
    activate();
    function activate() {
      UserProfileService.validateUser()
        .then(function() {
          return CardService.getUserCards();
        })
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load credit cards. Please try again.';
          vm.loading = false;
        });
    }
    function selectCard(cardId) {
      $state.go('cardDetail', {cardId: cardId});
    }
  }
})();