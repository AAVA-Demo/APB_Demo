(function() {
  'use strict';
  angular.module('multiCardManagement').controller('CardManagementController', ['CardManagementService', '$scope', '$location', function(CardManagementService, $scope, $location) {
    const vm = this;
    vm.portfolio = null;
    vm.loading = true;
    vm.error = null;
    vm.filterText = '';
    vm.selectedCards = [];
    vm.showComparison = false;
    vm.loadPortfolio = function() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getCardPortfolio().then(data => {
        vm.portfolio = data;
        vm.loading = false;
      }).catch(err => {
        vm.error = 'Failed to load card portfolio. Please try again.';
        vm.loading = false;
      });
    };
    vm.retry = function() {
      vm.loadPortfolio();
    };
    vm.viewCardDetail = function(cardId) {
      $location.path('/cards/' + cardId);
    };
    vm.toggleCardSelection = function(card) {
      const index = vm.selectedCards.findIndex(c => c.cardId === card.cardId);
      if (index > -1) {
        vm.selectedCards.splice(index, 1);
      } else {
        vm.selectedCards.push(card);
      }
      vm.showComparison = vm.selectedCards.length > 1;
    };
    vm.isSelected = function(card) {
      return vm.selectedCards.some(c => c.cardId === card.cardId);
    };
    vm.loadPortfolio();
  }]);
})();