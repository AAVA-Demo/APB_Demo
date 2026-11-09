(function() {
  'use strict';
  angular.module('multiCardManagement').controller('CardDetailController', ['CardManagementService', '$routeParams', '$scope', function(CardManagementService, $routeParams, $scope) {
    const vm = this;
    vm.card = null;
    vm.loading = true;
    vm.error = null;
    const cardId = $routeParams.cardId;
    vm.loadCardDetail = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getCardDetail(cardId).then(data => {
        vm.card = data;
        vm.loading = false;
      }).catch(err => {
        vm.error = 'Failed to load card details. Please try again.';
        vm.loading = false;
      });
    };
    vm.retry = function() {
      vm.loadCardDetail();
    };
    vm.loadCardDetail();
  }]);
})();