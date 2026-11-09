(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .controller('PortfolioController', ['PortfolioService', '$scope', '$filter', '$routeParams', '$location', function(PortfolioService, $scope, $filter, $routeParams, $location) {
      var vm = this;
      vm.cards = [];
      vm.analysis = {};
      vm.selectedCard = null;
      vm.loading = true;
      vm.error = null;
      vm.filterText = '';
      vm.loadPortfolio = function() {
        vm.loading = true;
        PortfolioService.getPortfolio().then(function(data) {
          vm.cards = data.cards;
          vm.analysis = data.analysis;
          vm.loading = false;
          if ($routeParams.cardId) {
            vm.selectCard($routeParams.cardId);
          }
        }).catch(function(error) {
          vm.error = 'Failed to load portfolio';
          vm.loading = false;
          console.error('Portfolio load error:', error);
        });
      };
      vm.selectCard = function(cardId) {
        var card = vm.cards.find(function(c) { return c.cardId === cardId; });
        if (card) {
          vm.selectedCard = card;
          vm.selectedCard.analysis = vm.analysis[cardId];
          $location.path('/portfolio/' + cardId);
        }
      };
      vm.clearSelection = function() {
        vm.selectedCard = null;
        $location.path('/portfolio');
      };
      vm.getFilteredCards = function() {
        if (!vm.filterText) return vm.cards;
        return $filter('filter')(vm.cards, vm.filterText);
      };
      vm.loadPortfolio();
    }]);
})();