(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['$scope', '$location', 'CardManagementService', function($scope, $location, CardManagementService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        CardManagementService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
          });
      };
      vm.viewCardDetails = function(cardId) {
        $location.path('/card-management/' + cardId);
      };
      vm.init();
    }]);
})();