(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardList', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&',
          selectedCard: '='
        },
        template: '<div class="card-list">' +
                  '<div ng-repeat="card in cards" class="card-item" ng-class="{selected: isSelected(card)}" ng-click="selectCard(card)">' +
                  '<div class="card-number">{{card.cardNumber}}</div>' +
                  '<div class="card-type">{{card.cardType}}</div>' +
                  '<div class="row" style="margin-top: 10px;">' +
                  '<div class="col-xs-6"><small>Limit: ${{card.creditLimit | number:0}}</small></div>' +
                  '<div class="col-xs-6"><small>Available: ${{card.availableCredit | number:2}}</small></div>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.selectCard = function(card) {
            scope.onSelect({ card: card });
          };
          scope.isSelected = function(card) {
            return scope.selectedCard && scope.selectedCard.cardId === card.cardId;
          };
        }
      };
    }]);
})();