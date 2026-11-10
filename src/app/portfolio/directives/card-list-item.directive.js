(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .directive('cardListItem', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-item" ng-click="onSelect({cardId: card.cardId})"><div class="row"><div class="col-xs-8"><h4 style="margin-top:0;">{{card.cardName}}</h4><p class="text-muted">{{card.cardType}} ****{{card.cardNumber.slice(-4)}}</p></div><div class="col-xs-4 text-right"><p><strong>Limit:</strong> {{card.creditLimit | currency}}</p><p><strong>Available:</strong> {{card.availableCredit | currency}}</p><p class="text-danger"><strong>Outstanding:</strong> {{card.outstandingBalance | currency}}</p></div></div></div>'
      };
    }]);
})();