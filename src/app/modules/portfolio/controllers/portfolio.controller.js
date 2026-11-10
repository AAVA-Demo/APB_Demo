(function() {
  'use strict';
  angular.module('app.portfolio')
    .controller('PortfolioController', ['PortfolioService', 'CardFilterFactory', '$scope', '$routeParams', '$location', function(PortfolioService, CardFilterFactory, $scope, $routeParams, $location) {
      var vm = this;
      vm.cards = [];
      vm.filteredCards = [];
      vm.selectedCard = null;
      vm.cardDetail = null;
      vm.loading = true;
      vm.error = null;
      vm.userId = 'user123';
      vm.filterType = 'all';

      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        PortfolioService.getUserCards(vm.userId)
          .then(function(cards) {
            vm.cards = cards;
            vm.filteredCards = cards;
            vm.loading = false;
            if ($routeParams.cardId) {
              vm.loadCardDetail($routeParams.cardId);
            }
          })
          .catch(function(err) {
            vm.error = 'Failed to load credit cards';
            vm.loading = false;
            console.error('Portfolio error:', err);
          });
      };

      vm.loadCardDetail = function(cardId) {
        vm.selectedCard = vm.cards.find(c => c.cardId === cardId);
        if (!vm.selectedCard) return;
        var currentMonth = new Date().toISOString().slice(0, 7);
        PortfolioService.getCardSpendDetail(cardId, currentMonth)
          .then(function(detail) {
            vm.cardDetail = detail;
          })
          .catch(function(err) {
            console.error('Card detail error:', err);
          });
      };

      vm.selectCard = function(card) {
        $location.path('/portfolio/' + card.cardId);
      };

      vm.applyFilter = function(filterType) {
        vm.filterType = filterType;
        vm.filteredCards = CardFilterFactory.filterCards(vm.cards, filterType);
      };

      vm.backToList = function() {
        $location.path('/portfolio');
      };

      vm.loadCards();
    }]);
})();