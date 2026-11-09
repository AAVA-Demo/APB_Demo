(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['CardManagementService', '$scope', '$stateParams', '$state', function(CardManagementService, $scope, $stateParams, $state) {
      var vm = this;
      vm.card = null;
      vm.spendSummary = null;
      vm.loading = true;
      vm.error = null;
      vm.goBack = goBack;
      activate();
      function activate() {
        var cardId = $stateParams.cardId;
        if (!cardId) {
          vm.error = 'Invalid card ID';
          vm.loading = false;
          return;
        }
        loadCardDetail(cardId);
      }
      function loadCardDetail(cardId) {
        vm.loading = true;
        vm.error = null;
        CardManagementService.getCardSpend(cardId)
          .then(function(data) {
            vm.card = data.card;
            vm.spendSummary = data.spendSummary;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
            console.error('Error loading card detail:', error);
          });
      }
      function goBack() {
        $state.go('cards');
      }
    }]);
})();