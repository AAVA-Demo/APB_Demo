(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .controller('CardDetailsController', ['$scope', '$stateParams', 'cardManagementService', function($scope, $stateParams, cardManagementService) {
      var vm = this;
      vm.card = null;
      vm.loading = true;
      vm.error = null;
      vm.spendAnalysis = {};
      cardManagementService.getCardDetails($stateParams.cardId).then(function(card) {
        vm.card = card;
        vm.spendAnalysis = {
          monthlySpend: card.currentBalance * 0.3,
          utilizationRate: ((card.currentBalance / card.creditLimit) * 100).toFixed(2)
        };
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load card details';
        vm.loading = false;
      });
    }]);
})();