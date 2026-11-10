(function() {
  'use strict';
  angular.module('cardManagementModule').controller('CardListController', ['$scope', '$location', 'UserProfileService', 'CreditCardService', function($scope, $location, UserProfileService, CreditCardService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCardId = null;
    function loadCards() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      UserProfileService.getUserCards(userId)
        .then(function(cardIds) {
          return CreditCardService.getCardDetails(cardIds);
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
    vm.selectCard = function(cardId) {
      vm.selectedCardId = cardId;
      $location.path('/cards/' + cardId);
    };
    loadCards();
  }]);
})();