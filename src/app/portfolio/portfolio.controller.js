(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .controller('PortfolioController', ['$scope', '$location', 'CardManagementService', 'CardDataFactory', 'AuthService', 'toastr', function($scope, $location, CardManagementService, CardDataFactory, AuthService, toastr) {
      const vm = this;
      vm.cards = [];
      vm.loading = true;
      const user = AuthService.getCurrentUser();
      const userId = user.userId;
      vm.loadCards = function() {
        const cached = CardDataFactory.getCachedCardList();
        if (cached) {
          vm.cards = cached;
          vm.loading = false;
          return;
        }
        CardManagementService.getCardList(userId)
          .then(function(cards) {
            vm.cards = cards;
            CardDataFactory.cacheCardList(cards);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.loading = false;
            toastr.error('Failed to load card portfolio');
          });
      };
      vm.viewCardDetail = function(cardId) {
        CardDataFactory.setSelectedCard(cardId);
        $location.path('/card-detail/' + cardId);
      };
      vm.refreshCards = function() {
        vm.loading = true;
        CardDataFactory.clearCache();
        vm.loadCards();
      };
      vm.loadCards();
    }]);
})();