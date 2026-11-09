(function() {
  'use strict';
  angular.module('creditCardManagement')
    .controller('CardListController', ['$scope', '$state', 'CardManagementService', CardListController]);
  function CardListController($scope, $state, CardManagementService) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      vm.loading = true;
      CardManagementService.getAllUserCards()
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load credit cards. Please try again.';
          vm.loading = false;
        });
    };
    vm.selectCard = function(cardId) {
      $state.go('cardDetail', {cardId: cardId});
    };
    vm.init();
  }
})();