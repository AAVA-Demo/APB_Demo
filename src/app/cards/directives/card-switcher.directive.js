(function() {
  'use strict';
  angular.module('app.cards')
    .directive('cardSwitcher', ['CreditCardService', 'CardContextFactory', '$location', function(CreditCardService, CardContextFactory, $location) {
      return {
        restrict: 'E',
        template: '<div class="card-switcher">' +
                  '  <label>Switch Card:</label>' +
                  '  <select class="form-control" ng-model="selectedCardId" ng-change="switchCard()" ng-options="card.cardId as (card.cardType + \'  \' + card.cardNumber) for card in cards">' +
                  '    <option value="">Select a card...</option>' +
                  '  </select>' +
                  '</div>',
        link: function(scope) {
          scope.cards = [];
          scope.selectedCardId = CardContextFactory.getSelectedCardId();
          
          CreditCardService.getAllCards()
            .then(function(cards) {
              scope.cards = cards;
            });
          
          scope.switchCard = function() {
            if (scope.selectedCardId) {
              CardContextFactory.setSelectedCard(scope.selectedCardId);
              $location.path('/cards/' + scope.selectedCardId);
            }
          };
        }
      };
    }]);
})();