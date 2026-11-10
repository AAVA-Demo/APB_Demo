(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardDetailController', ['CardManagementService', 'CreditCardDataFactory', '$routeParams', '$scope', function(CardManagementService, CreditCardDataFactory, $routeParams, $scope) {
      var vm = this;
      vm.card = null;
      vm.loading = true;
      vm.error = null;
      var cardId = $routeParams.cardId;
      CardManagementService.getCardById(cardId)
        .then(function(card) {
          vm.card = card;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details';
          vm.loading = false;
        });
    }]);
})();