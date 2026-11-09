(function() {
  'use strict';
  angular.module('cardManagementModule')
    .directive('cardSwitcher', ['cardManagementService', function(cardManagementService) {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&'
        },
        template: '<div class="card-switcher"><div ng-repeat="card in cards track by card.cardId" class="card-item" ng-class="{active: card.selected}" ng-click="selectCard(card)"><strong>{{card.issuer}}</strong> - {{card.cardNumber}}<br><small>{{card.cardType}}</small></div></div>',
        link: function(scope, element, attrs) {
          scope.selectCard = function(card) {
            angular.forEach(scope.cards, function(c) {
              c.selected = false;
            });
            card.selected = true;
            scope.onSelect({card: card});
          };
        }
      };
    }]);
})();