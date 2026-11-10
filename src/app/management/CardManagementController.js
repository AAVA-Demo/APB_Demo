(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardManagementController', ['UserProfileService', 'AuthService', '$scope', '$rootScope', function(UserProfileService, AuthService, $scope, $rootScope) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCard = null;
      AuthService.validateUser()
        .then(function(user) {
          return UserProfileService.getUserCards(user.userId);
        })
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
          if (cards.length > 0) {
            vm.selectCard(cards[0]);
          }
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load cards';
          vm.loading = false;
          $scope.$apply();
        });
      vm.selectCard = function(card) {
        vm.selectedCard = card;
        $rootScope.$broadcast('cardSelected', card);
      };
    }]);
})();