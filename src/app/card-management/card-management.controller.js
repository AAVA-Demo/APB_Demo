(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['CardManagementService', '$scope', '$state', function(CardManagementService, $scope, $state) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.searchText = '';
      vm.selectCard = selectCard;
      activate();
      function activate() {
        loadCards();
      }
      function loadCards() {
        vm.loading = true;
        vm.error = null;
        CardManagementService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
            console.error('Error loading cards:', error);
          });
      }
      function selectCard(cardId) {
        $state.go('cardDetail', { cardId: cardId });
      }
    }]);
})();