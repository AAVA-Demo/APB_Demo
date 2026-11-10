(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardList', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          selectedCard: '=',
          onSelect: '&'
        },
        template: '<div><h4>All Cards ({{cards.length}})</h4><div ng-repeat="card in cards" class="card-item" ng-class="{selected: card.cardId === selectedCard.cardId}" ng-click="onSelect({card: card})"><div><strong>{{card.cardType}}</strong> {{card.cardNumber}}</div><div class="text-muted">Limit: {{card.creditLimit | currency:"₹"}} | Available: {{card.availableCredit | currency:"₹"}}</div></div></div>'
      };
    }]);
})();