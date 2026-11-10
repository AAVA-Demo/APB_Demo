(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['$scope', '$routeParams', 'CardService', function($scope, $routeParams, CardService) {
      var vm = this;
      vm.card = null;
      vm.spending = null;
      vm.loading = true;
      vm.error = null;
      var cardId = $routeParams.cardId;
      function loadCardDetails() {
        vm.loading = true;
        CardService.getCards()
          .then(function(cards) {
            vm.card = cards.find(function(c) { return c.cardId === cardId; });
            if (!vm.card) {
              vm.error = 'Card not found';
              vm.loading = false;
              $scope.$apply();
              return;
            }
            return CardService.getCardSpending(cardId);
          })
          .then(function(spending) {
            vm.spending = spending;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load card details';
            vm.loading = false;
            $scope.$apply();
          });
      }
      loadCardDetails();
    }]);
})();