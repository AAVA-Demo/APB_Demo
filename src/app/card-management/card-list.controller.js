(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardListController', ['$scope', '$state', 'CardService', function($scope, $state, CardService) {
      var vm = this;
      vm.portfolio = null;
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.sortBy = 'cardType';
      vm.filterText = '';
      vm.viewCardDetail = function(cardId) {
        $state.go('cardDetail', { cardId: cardId });
      };
      vm.sortCards = function(field) {
        vm.sortBy = field;
      };
      function loadPortfolio() {
        vm.loading = true;
        CardService.getCardPortfolio().then(function(data) {
          vm.portfolio = data;
          vm.cards = data.cards || [];
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load card portfolio. Please try again.';
          vm.loading = false;
        });
      }
      loadPortfolio();
    }]);
  CardListController.$inject = ['$scope', '$state', 'CardService'];
})();