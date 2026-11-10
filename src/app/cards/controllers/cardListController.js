(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .controller('CardListController', ['$scope', '$state', 'cardManagementService', function($scope, $state, cardManagementService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.selectCard = function(card) {
        $state.go('cardDetails', {cardId: card.cardId});
      };
      cardManagementService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load cards';
        vm.loading = false;
      });
    }]);
})();