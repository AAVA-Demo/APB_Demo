(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardListController', CardListController);
  CardListController.$inject = ['CardDataService', '$scope', '$state', 'cards'];
  function CardListController(CardDataService, $scope, $state, cards) {
    var vm = this;
    vm.cards = cards || [];
    vm.loading = false;
    vm.error = null;
    vm.selectCard = selectCard;
    function selectCard(cardId) {
      $state.go('cardDetail', { cardId: cardId });
    }
  }
})();