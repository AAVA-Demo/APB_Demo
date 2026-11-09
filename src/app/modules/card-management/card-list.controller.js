(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['CardManagementService', '$scope', function(CardManagementService, $scope) {
      const vm = this;
      vm.cardList = {};
      vm.loading = true;
      vm.error = null;
      vm.selectedCard = null;

      vm.loadCards = function() {
        vm.loading = true;
        const userId = 'user123';
        CardManagementService.getUserCards(userId)
          .then(function(data) {
            vm.cardList = data;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards';
            vm.loading = false;
            console.error('Card list load error:', error);
          });
      };

      vm.selectCard = function(card) {
        vm.selectedCard = card;
      };

      vm.closeDetails = function() {
        vm.selectedCard = null;
      };

      vm.loadCards();
    }]);
})();