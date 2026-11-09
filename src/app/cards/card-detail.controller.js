(function() {
  'use strict';
  angular.module('cardManagementModule').controller('CardDetailController', ['CardManagementService', '$routeParams', '$scope', function(CardManagementService, $routeParams, $scope) {
    const vm = this;
    vm.card = null;
    vm.spendSummary = null;
    vm.loading = true;
    vm.error = null;
    const cardId = $routeParams.cardId;
    CardManagementService.getCardDetails(cardId).then(function(data) {
      vm.card = data.card;
      vm.spendSummary = data.spendSummary;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load card details';
      vm.loading = false;
    });
  }]);
})();