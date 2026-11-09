(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardSwitcher', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          selectedCard: '=',
          onSelect: '=',
          comparisonMode: '=',
          selectedForComparison: '='
        },
        template: '<div><div class="card-item" ng-repeat="card in cards" ng-click="selectCard(card)" ng-class="{\"active\": card.cardId === selectedCard.cardId}"><input type="checkbox" ng-if="comparisonMode" ng-model="selected[card.cardId]" ng-change="updateComparison(card.cardId)" style="margin-right:10px;"><strong class="card-number">{{card.maskedNumber}}</strong><br><small>{{card.cardType}} | Limit: {{card.creditLimit | currency:\'₹\'}} | Available: {{card.availableCredit | currency:\'₹\'}}</small></div></div>',
        link: function(scope) {
          scope.selected = {};
          scope.selectCard = function(card) {
            if (!scope.comparisonMode && scope.onSelect) scope.onSelect(card);
          };
          scope.updateComparison = function(cardId) {
            if (scope.selected[cardId]) {
              if (scope.selectedForComparison.indexOf(cardId) === -1) scope.selectedForComparison.push(cardId);
            } else {
              var idx = scope.selectedForComparison.indexOf(cardId);
              if (idx !== -1) scope.selectedForComparison.splice(idx, 1);
            }
          };
        }
      };
    }]);
})();