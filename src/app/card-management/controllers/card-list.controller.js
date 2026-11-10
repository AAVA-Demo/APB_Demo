(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['CardManagementService', '$scope', '$location', function(CardManagementService, $scope, $location) {
      const vm = this;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.currentPage = 1;
      vm.pageSize = 10;
      vm.loadCards = function() {
        vm.loading = true;
        CardManagementService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load cards. Please try again.';
            vm.loading = false;
            console.error('Card list error:', err);
          });
      };
      vm.navigateToDetail = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.getPaginatedCards = function() {
        const start = (vm.currentPage - 1) * vm.pageSize;
        return vm.cards.slice(start, start + vm.pageSize);
      };
      vm.nextPage = function() {
        if (vm.currentPage * vm.pageSize < vm.cards.length) {
          vm.currentPage++;
        }
      };
      vm.prevPage = function() {
        if (vm.currentPage > 1) {
          vm.currentPage--;
        }
      };
      vm.loadCards();
    }]);
})();