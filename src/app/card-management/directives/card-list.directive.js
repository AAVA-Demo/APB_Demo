(function() {
  'use strict';
  angular.module('cardManagement')
    .directive('cardList', ['CardManagementService', function(CardManagementService) {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&'
        },
        template: '<div class="row"><div class="col-xs-12 col-sm-6 col-md-4" ng-repeat="card in cards"><div class="card-item" ng-click="selectCard(card.cardId)"><div class="card-number">{{ card.cardType }} •••• {{ card.lastFourDigits }}</div><div class="card-balance">{{ card.availableCredit | currency }}</div><div><small class="text-muted">Available Credit</small></div><div><small>Limit: {{ card.creditLimit | currency }}</small></div></div></div></div>',
        link: function(scope) {
          scope.selectCard = function(cardId) {
            scope.onSelect({ cardId: cardId });
          };
        }
      };
    }]);
})();