(function() {
  'use strict';
  angular.module('creditCard.management')
    .controller('CardDetailsController', ['CardService', '$routeParams', '$scope', '$location', CardDetailsController]);
  function CardDetailsController(CardService, $routeParams, $scope, $location) {
    const vm = this;
    vm.card = null;
    vm.loading = true;
    vm.error = null;
    vm.goBack = goBack;
    init();
    function init() {
      const cardId = $routeParams.cardId;
      CardService.getCardById(cardId)
        .then(function(card) {
          vm.card = card;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details.';
          vm.loading = false;
        });
    }
    function goBack() {
      $location.path('/cards');
    }
  }
})();