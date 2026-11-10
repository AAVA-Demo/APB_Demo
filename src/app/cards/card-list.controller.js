(function() {
  'use strict';
  angular.module('app.cards')
    .controller('CardListController', ['CreditCardService', 'CardContextFactory', '$scope', '$location', function(CreditCardService, CardContextFactory, $scope, $location) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.cards = [];
      
      vm.loadCards = function() {
        vm.loading = true;
        vm.error = null;
        CreditCardService.getAllCards()
          .then(function(cards) {
            vm.cards = cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load credit cards. Please try again.';
            vm.loading = false;
          });
      };
      
      vm.selectCard = function(card) {
        CardContextFactory.setSelectedCard(card.cardId);
        $location.path('/cards/' + card.cardId);
      };
      
      vm.getCardTypeClass = function(cardType) {
        return cardType ? cardType.toLowerCase() : '';
      };
      
      vm.loadCards();
    }]);
})();