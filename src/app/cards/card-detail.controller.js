(function() {
  'use strict';
  angular.module('app.cards')
    .controller('CardDetailController', ['CreditCardService', 'CardContextFactory', '$routeParams', '$scope', function(CreditCardService, CardContextFactory, $routeParams, $scope) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.card = null;
      vm.transactions = [];
      vm.spendAnalysis = null;
      
      vm.loadCardDetails = function() {
        var cardId = $routeParams.cardId;
        vm.loading = true;
        vm.error = null;
        CreditCardService.getCardDetails(cardId)
          .then(function(data) {
            vm.card = data.card;
            vm.transactions = data.transactions;
            vm.spendAnalysis = data.spendAnalysis;
            CardContextFactory.setSelectedCard(cardId);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load card details. Please try again.';
            vm.loading = false;
          });
      };
      
      vm.getCategoryClass = function(category) {
        var classes = {
          'Food & Dining': 'label-warning',
          'Fuel': 'label-info',
          'Shopping': 'label-primary',
          'Travel': 'label-success',
          'Entertainment': 'label-danger',
          'Utilities': 'label-default',
          'Healthcare': 'label-info',
          'Education': 'label-primary',
          'Miscellaneous': 'label-default'
        };
        return 'label ' + (classes[category] || 'label-default');
      };
      
      vm.loadCardDetails();
      
      $scope.$on('cardChanged', function(event, cardId) {
        if (cardId !== $routeParams.cardId) {
          vm.loadCardDetails();
        }
      });
    }]);
})();