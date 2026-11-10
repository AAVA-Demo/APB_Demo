(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardListController', ['$scope', '$location', 'CardManagementService', 'CardSwitchService', function($scope, $location, CardManagementService, CardSwitchService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCardId = CardSwitchService.getSelectedCard();
    vm.loadCards = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getAllCards().then(function(data) {
        vm.cards = data.cards;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load credit cards. Please try again.';
        vm.loading = false;
        console.error('Card load error:', err);
      });
    };
    vm.selectCard = function(cardId) {
      CardSwitchService.setSelectedCard(cardId);
      vm.selectedCardId = cardId;
      $location.path('/cards/' + cardId);
    };
    vm.loadCards();
  }]);
})();