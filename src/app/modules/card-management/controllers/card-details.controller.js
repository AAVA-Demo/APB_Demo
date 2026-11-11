(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailsController', ['$scope', '$routeParams', '$location', 'CardService', 'SpendAnalyticsService', function($scope, $routeParams, $location, CardService, SpendAnalyticsService) {
      var vm = this;
      vm.card = null;
      vm.spendData = null;
      vm.loading = true;
      vm.error = null;
      var cardId = $routeParams.cardId;
      function loadCardDetails() {
        vm.loading = true;
        vm.error = null;
        CardService.getCardById(cardId)
          .then(function(card) {
            vm.card = card;
            return SpendAnalyticsService.getCardSpend(cardId);
          })
          .then(function(spendData) {
            vm.spendData = spendData;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
          });
      }
      vm.goBack = function() {
        $location.path('/cards');
      };
      vm.getUtilizationPercentage = function() {
        if (!vm.card) return 0;
        return ((vm.card.outstandingAmount / vm.card.creditLimit) * 100).toFixed(1);
      };
      loadCardDetails();
    }]);
})();