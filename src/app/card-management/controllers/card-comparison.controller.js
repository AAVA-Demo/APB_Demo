(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardComparisonController', ['CardManagementService', '$scope', function(CardManagementService, $scope) {
      const vm = this;
      vm.cards = [];
      vm.selectedCards = [];
      vm.loading = true;
      vm.loadCards = function() {
        CardManagementService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          });
      };
      vm.toggleCardSelection = function(card) {
        const idx = vm.selectedCards.findIndex(c => c.cardId === card.cardId);
        if (idx > -1) {
          vm.selectedCards.splice(idx, 1);
        } else if (vm.selectedCards.length < 3) {
          vm.selectedCards.push(card);
        }
      };
      vm.isSelected = function(card) {
        return vm.selectedCards.some(c => c.cardId === card.cardId);
      };
      vm.loadCards();
    }]);
})();