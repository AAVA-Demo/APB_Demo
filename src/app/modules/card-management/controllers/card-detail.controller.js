(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardDetailController', CardDetailController);
  CardDetailController.$inject = ['cardManagementService', 'cardInfoService', '$routeParams', '$scope'];
  function CardDetailController(cardManagementService, cardInfoService, $routeParams, $scope) {
    var vm = this;
    vm.card = null;
    vm.analysis = null;
    vm.loading = true;
    vm.init = function() {
      var cardId = $routeParams.cardId;
      cardInfoService.getCardDetails(cardId).then(function(card) {
        vm.card = card;
        return cardManagementService.getCardAnalysis(cardId);
      }).then(function(analysis) {
        vm.analysis = analysis;
        vm.loading = false;
      }).catch(function() {
        vm.loading = false;
      });
    };
    vm.init();
  }
})();