(function() {
  'use strict';
  angular.module('cardManagementModule')
    .directive('cardSwitcher', ['CardService', function(CardService) {
      return {
        restrict: 'E',
        scope: {
          currentCardId: '=',
          onSwitch: '&'
        },
        template: '<div class="card-switcher"><label>Switch Card:</label><select class="form-control" ng-model="selectedCardId" ng-change="switchCard()" ng-options="card.cardId as (card.cardNumber + \" - \" + card.cardType) for card in cards"></select></div>',
        link: function(scope) {
          scope.cards = [];
          scope.selectedCardId = scope.currentCardId;
          CardService.getAllCards('user123').then(function(cards) {
            scope.cards = cards;
          });
          scope.switchCard = function() {
            if (scope.selectedCardId && scope.selectedCardId !== scope.currentCardId) {
              scope.onSwitch({ cardId: scope.selectedCardId });
            }
          };
          scope.$watch('currentCardId', function(newVal) {
            scope.selectedCardId = newVal;
          });
        }
      };
    }]);
})();