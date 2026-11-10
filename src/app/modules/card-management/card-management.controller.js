(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardManagementController', ['CardService', 'UserProfileFactory', '$scope', '$location', CardManagementController]);
  function CardManagementController(CardService, UserProfileFactory, $scope, $location) {
    var vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      vm.loadCards();
    };
    vm.loadCards = function() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      UserProfileFactory.getUserCards(userId)
        .then(function(cardIds) {
          return CardService.getCardSummaries(cardIds);
        })
        .then(function(cards) {
          vm.cards = cards;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load cards';
          vm.loading = false;
          toastr.error('Unable to fetch card data', 'Error');
          $scope.$apply();
        });
    };
    vm.selectCard = function(cardId) {
      $location.path('/cards/' + cardId);
    };
    vm.init();
  }
})();