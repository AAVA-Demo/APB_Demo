(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardSelector', ['CardService', function(CardService) {
      return {
        restrict: 'E',
        scope: {
          selectedCard: '=',
          onCardChange: '&'
        },
        template: '<div class="form-group"><label>Select Card:</label><select class="form-control" ng-model="selectedCard" ng-options="card.cardId as (card.cardType + \' \' + card.cardNumber) for card in cards" ng-change="cardChanged()"></select></div>',
        link: function(scope, element, attrs) {
          scope.cards = [];
          CardService.getAllCards().then(function(cards) {
            scope.cards = cards;
          });
          scope.cardChanged = function() {
            if (scope.onCardChange) {
              scope.onCardChange({ cardId: scope.selectedCard });
            }
          };
        }
      };
    }]);
})();