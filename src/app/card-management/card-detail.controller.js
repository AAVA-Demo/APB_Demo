(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardDetailController', ['$scope', '$stateParams', 'CardDataService', 'SpendingCalculationService', function($scope, $stateParams, CardDataService, SpendingCalculationService) {
      var vm = this;
      vm.card = {};
      vm.spending = {};
      vm.loading = true;
      vm.error = null;
      function loadCardDetail() {
        vm.loading = true;
        var cardId = $stateParams.cardId;
        CardDataService.getCardById(cardId).then(function(card) {
          vm.card = card;
          return SpendingCalculationService.calculateSpending(cardId);
        }).then(function(spending) {
          vm.spending = spending;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load card details.';
          vm.loading = false;
        });
      }
      loadCardDetail();
    }]);
})();