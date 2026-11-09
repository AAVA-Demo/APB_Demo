(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardListController', ['$scope', '$location', 'CardService', function($scope, $location, CardService) {
      var vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.userId = 'user123';
      vm.selectedCard = null;
      vm.loadCards = function() {
        vm.loading = true;
        CardService.getAllCards(vm.userId).then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load credit cards. Please try again.';
          vm.loading = false;
        });
      };
      vm.viewCardDetails = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.loadCards();
    }]);
})();