(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardListController', ['CardManagementService', 'AuthService', '$scope', '$location', function(CardManagementService, AuthService, $scope, $location) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.selectCard = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      var userId = AuthService.getUserId();
      CardManagementService.getUserCards(userId)
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load cards';
          vm.loading = false;
        });
    }]);
})();