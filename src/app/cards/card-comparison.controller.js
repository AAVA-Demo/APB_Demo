(function() {
  'use strict';
  angular.module('cardManagementModule').controller('CardComparisonController', ['CardManagementService', '$routeParams', '$scope', function(CardManagementService, $routeParams, $scope) {
    const vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    const cardIds = $routeParams.cardIds.split(',');
    CardManagementService.compareCards(cardIds).then(function(cards) {
      vm.cards = cards;
      vm.loading = false;
    }).catch(function(error) {
      vm.error = 'Failed to load card comparison';
      vm.loading = false;
    });
  }]);
})();