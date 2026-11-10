(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardDetailController', ['$scope', '$routeParams', 'CardManagementService', 'CardSwitchService', function($scope, $routeParams, CardManagementService, CardSwitchService) {
    var vm = this;
    vm.card = null;
    vm.loading = true;
    vm.error = null;
    var cardId = $routeParams.cardId;
    vm.loadCardDetails = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getCardDetails(cardId).then(function(data) {
        vm.card = data;
        CardSwitchService.setSelectedCard(cardId);
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load card details. Please try again.';
        vm.loading = false;
        console.error('Card detail load error:', err);
      });
    };
    vm.loadCardDetails();
  }]);
})();