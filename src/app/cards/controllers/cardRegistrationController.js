(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .controller('CardRegistrationController', ['$scope', '$state', 'cardManagementService', 'authService', function($scope, $state, cardManagementService, authService) {
      var vm = this;
      vm.newCard = {};
      vm.submitting = false;
      vm.error = null;
      vm.submitCard = function() {
        vm.submitting = true;
        authService.getCurrentUser().then(function(user) {
          vm.newCard.userId = user.userId;
          return cardManagementService.registerCard(vm.newCard);
        }).then(function() {
          $state.go('cards');
        }).catch(function(err) {
          vm.error = 'Failed to register card';
          vm.submitting = false;
        });
      };
    }]);
})();