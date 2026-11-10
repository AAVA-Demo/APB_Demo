(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardTile', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-tile" ng-click="selectCard()"><div class="card-number">{{card.cardNumber}}</div><div class="card-type">{{card.cardType}} - {{card.issuer}}</div><div class="balance">Balance: ${{card.currentBalance | number:2}}</div><div>Credit Limit: ${{card.creditLimit | number:2}}</div><div class="progress"><div class="progress-bar" role="progressbar" ng-style="{width: utilizationPercent + \'%\'}" aria-valuenow="{{utilizationPercent}}" aria-valuemin="0" aria-valuemax="100">{{utilizationPercent}}%</div></div></div>',
        link: function(scope) {
          scope.$watch('card', function(card) {
            if (card && card.creditLimit > 0) {
              scope.utilizationPercent = Math.round((card.currentBalance / card.creditLimit) * 100);
            } else {
              scope.utilizationPercent = 0;
            }
          });
          scope.selectCard = function() {
            scope.onSelect({card: scope.card});
          };
        }
      };
    }]);
})();