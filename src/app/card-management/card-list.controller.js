(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['$scope', '$state', 'CardService', function($scope, $state, CardService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.filterType = '';
      function loadCards() {
        vm.loading = true;
        CardService.getAllCards().then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load credit cards';
          vm.loading = false;
          console.error('Card load error:', error);
        });
      }
      loadCards();
      vm.viewCardDetail = function(cardId) {
        $state.go('cardDetail', {cardId: cardId});
      };
      vm.getUtilizationClass = function(percent) {
        if (percent >= 80) return 'danger';
        if (percent >= 60) return 'warning';
        return 'success';
      };
    }]);
})();