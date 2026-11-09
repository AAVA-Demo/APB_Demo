(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardDetailController', ['CardManagementService', '$routeParams', '$scope', function(CardManagementService, $routeParams, $scope) {
      var vm = this;
      vm.card = null;
      vm.loading = true;
      vm.error = null;
      function loadCardDetails() {
        vm.loading = true;
        vm.error = null;
        var cardId = $routeParams.cardId;
        CardManagementService.getCardDetails(cardId).then(function(card) {
          vm.card = card;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
      }
      loadCardDetails();
    }]);
})();