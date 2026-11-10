(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['CardService', '$state', function(CardService, $state) {
      const vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.loadCards = function() {
        CardService.fetchUserCards().then(function(data) {
          vm.cards = data;
          vm.loading = false;
        }).catch(function(error) {
          console.error('Error loading cards:', error);
          vm.loading = false;
        });
      };
      vm.selectCard = function(card) {
        $state.go('cardDetail', {cardId: card.cardId});
      };
      vm.loadCards();
    }]);
})();