(function() {
  'use strict';
  angular.module('creditCardManagement')
    .controller('CardDetailController', ['$scope', '$stateParams', '$state', 'CardManagementService', CardDetailController]);
  function CardDetailController($scope, $stateParams, $state, CardManagementService) {
    var vm = this;
    vm.card = null;
    vm.spendAnalysis = null;
    vm.loading = true;
    vm.error = null;
    vm.cardId = $stateParams.cardId;
    vm.init = function() {
      if (!vm.cardId) {
        $state.go('cards');
        return;
      }
      vm.loading = true;
      CardManagementService.getCardDetails(vm.cardId)
        .then(function(result) {
          vm.card = result.card;
          vm.spendAnalysis = result.spendAnalysis;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
    };
    vm.goBack = function() {
      $state.go('cards');
    };
    vm.init();
  }
})();