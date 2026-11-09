(function() {
  'use strict';
  angular.module('cardManagementModule').controller('CardListController', ['CardManagementService', '$scope', '$location', function(CardManagementService, $scope, $location) {
    const vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCards = [];
    vm.filters = { issuers: [], cardTypes: [], statuses: [] };
    function loadCards() {
      vm.loading = true;
      CardManagementService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load cards';
        vm.loading = false;
      });
    }
    vm.viewCardDetail = function(cardId) {
      $location.path('/cards/' + cardId);
    };
    vm.toggleCardSelection = function(cardId) {
      const index = vm.selectedCards.indexOf(cardId);
      if (index > -1) {
        vm.selectedCards.splice(index, 1);
      } else {
        vm.selectedCards.push(cardId);
      }
    };
    vm.compareCards = function() {
      if (vm.selectedCards.length > 1) {
        $location.path('/cards/compare/' + vm.selectedCards.join(','));
      }
    };
    loadCards();
  }]);
})();