(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['$scope', '$stateParams', '$state', 'CardService', function($scope, $stateParams, $state, CardService) {
      var vm = this;
      vm.card = null;
      vm.loading = true;
      vm.error = null;
      vm.cardId = $stateParams.cardId;
      vm.goBack = function() {
        $state.go('cardManagement');
      };
      function loadCardDetails() {
        vm.loading = true;
        CardService.getCardDetails(vm.cardId).then(function(data) {
          vm.card = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
      }
      loadCardDetails();
    }]);
  CardDetailController.$inject = ['$scope', '$stateParams', '$state', 'CardService'];
})();