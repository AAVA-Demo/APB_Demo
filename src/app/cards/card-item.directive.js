(function() {
  'use strict';
  angular.module('cardManagementModule').directive('cardItem', function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&'
      },
      template: '<div class="card-item" ng-click="onSelect({cardId: card.cardId})"><div class="row"><div class="col-xs-8"><h4>{{card.cardType}} - {{card.issuer}}</h4><p>{{card.cardNumber}}</p></div><div class="col-xs-4 text-right"><p><strong>Limit:</strong> ${{card.creditLimit | number:2}}</p><p><strong>Balance:</strong> ${{card.balance | number:2}}</p></div></div></div>'
    };
  });
})();