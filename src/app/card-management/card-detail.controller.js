(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['$scope', '$stateParams', '$state', 'CardService', function($scope, $stateParams, $state, CardService) {
      var vm = this;
      vm.card = null;
      vm.spendAnalysis = null;
      vm.loading = true;
      vm.error = null;
      var cardId = $stateParams.cardId;
      function loadCardDetail() {
        vm.loading = true;
        CardService.getCardById(cardId).then(function(card) {
          vm.card = card;
          return CardService.getCardSpendAnalysis(cardId);
        }).then(function(analysis) {
          vm.spendAnalysis = analysis;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load card details';
          vm.loading = false;
          console.error('Card detail error:', error);
        });
      }
      loadCardDetail();
      vm.goBack = function() {
        $state.go('cardList');
      };
      vm.getCategoryKeys = function() {
        return vm.spendAnalysis && vm.spendAnalysis.spendByCategory ? Object.keys(vm.spendAnalysis.spendByCategory) : [];
      };
    }]);
})();