(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['$scope', '$routeParams', '$location', 'CardService', function($scope, $routeParams, $location, CardService) {
      var vm = this;
      vm.card = null;
      vm.loading = true;
      vm.error = null;
      vm.goBack = goBack;
      init();
      function init() {
        var cardId = $routeParams.cardId;
        if (!cardId) {
          vm.error = 'Invalid card ID';
          vm.loading = false;
          return;
        }
        loadCardDetails(cardId);
      }
      function loadCardDetails(cardId) {
        vm.loading = true;
        vm.error = null;
        CardService.getCardDetails(cardId)
          .then(function(card) {
            vm.card = card;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
          });
      }
      function goBack() {
        $location.path('/cards');
      }
    }]);
})();