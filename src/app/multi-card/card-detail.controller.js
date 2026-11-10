(function() {
  'use strict';
  angular.module('creditCard.multiCardModule')
    .controller('CardDetailController', ['CardDataService', '$routeParams', '$scope', function(CardDataService, $routeParams, $scope) {
      var vm = this;
      vm.card = null;
      vm.spendAnalysis = null;
      vm.loading = true;
      vm.error = null;
      var cardId = $routeParams.cardId;
      function loadCardDetail() {
        CardDataService.fetchUserCards()
          .then(function(cards) {
            vm.card = cards.find(function(c) { return c.cardId === cardId; });
            if (!vm.card) {
              vm.error = 'Card not found';
              vm.loading = false;
              return;
            }
            return CardDataService.fetchCardSpendAnalysis(cardId);
          })
          .then(function(analysis) {
            vm.spendAnalysis = analysis;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.spendAnalysis = {
              categories: [
                { name: 'Food & Dining', amount: 5000 },
                { name: 'Fuel', amount: 3000 },
                { name: 'Shopping', amount: 8000 }
              ],
              totalSpend: 16000
            };
            vm.loading = false;
          });
      }
      loadCardDetail();
    }]);
})();