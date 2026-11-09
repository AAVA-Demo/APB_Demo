(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('cardTile', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '='
        },
        template: '<div class="card-tile panel panel-info"><div class="panel-heading"><h4>{{card.cardName}}</h4><p class="text-muted">{{card.cardNumber}}</p></div><div class="panel-body"><div class="row"><div class="col-xs-6"><strong>Credit Limit:</strong><br/>${{card.creditLimit | number:2}}</div><div class="col-xs-6"><strong>Outstanding:</strong><br/>${{card.outstandingAmount | number:2}}</div></div><div class="row" style="margin-top:10px;"><div class="col-xs-6"><strong>Available:</strong><br/>${{card.availableCredit | number:2}}</div><div class="col-xs-6"><strong>Type:</strong><br/>{{card.cardType}}</div></div></div></div>'
      };
    }]);
})();