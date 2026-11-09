(function() {
  'use strict';
  angular.module('cc.cardManagement')
    .controller('CardManagementController', ['$scope', 'CardManagementService', 'CardSelectionService', CardManagementController]);
  function CardManagementController($scope, CardManagementService, CardSelectionService) {
    var vm = this;
    vm.cards = [];
    vm.selectedCard = null;
    vm.loading = true;
    vm.error = null;
    vm.loadCards = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getAllCards()
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
          if (cards.length > 0) {
            vm.selectCard(cards[0]);
          }
        })
        .catch(function(error) {
          vm.error = 'Unable to load credit cards. Please try again.';
          vm.loading = false;
        });
    };
    vm.selectCard = function(card) {
      CardSelectionService.selectCard(card.cardId);
    };
    $scope.$on('card:selected', function(event, cardId) {
      vm.selectedCard = vm.cards.find(function(c) { return c.cardId === cardId; });
    });
    vm.loadCards();
  }
})();