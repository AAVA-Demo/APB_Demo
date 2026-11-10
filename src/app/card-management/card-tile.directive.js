(function() {
  'use strict';
  angular.module('creditCardManagementModule').directive('cardTile', function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onClick: '&'
      },
      template: '<div class="card-tile" ng-click="onClick({cardId: card.cardId})"><div class="row"><div class="col-xs-8"><h4 style="margin-top:0;">{{card.cardType}} {{card.cardNumber}}</h4><p style="margin:0;"><strong>{{card.cardHolderName}}</strong></p></div><div class="col-xs-4 text-right"><p style="margin:0;"><small>Limit</small></p><p style="margin:0;"><strong>${{card.creditLimit | number:2}}</strong></p></div></div><div class="row" style="margin-top:10px;"><div class="col-xs-6"><small>Balance: ${{card.currentBalance | number:2}}</small></div><div class="col-xs-6 text-right"><small>Available: ${{card.availableCredit | number:2}}</small></div></div><div class="utilization-bar"><div class="utilization-fill" ng-class="{high: card.utilization > 80}" ng-style="{width: card.utilization + \'%\'}"></div></div><div class="text-right" style="margin-top:5px;"><small>Utilization: {{card.utilization}}%</small></div></div>'
    };
  });
})();