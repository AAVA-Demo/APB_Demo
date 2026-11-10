(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        metrics: '=',
        onSelect: '&'
      },
      template: '<div class="row"><div class="col-xs-12 col-sm-6 col-md-4" ng-repeat="card in cards"><div class="panel panel-default card-item" ng-click="selectCard(card)"><div class="panel-body"><h4>{{card.cardType}} - {{card.cardNumber}}</h4><p><strong>Holder:</strong> {{card.cardHolderName}}</p><p><strong>Issuer:</strong> {{card.issuer}}</p><p><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</p><p><strong>Available:</strong> {{card.availableCredit | currency}}</p><p ng-if="metrics[card.cardId]"><strong>Monthly Spend:</strong> {{metrics[card.cardId].monthlySpend | currency}}</p><p ng-if="metrics[card.cardId]"><strong>Utilization:</strong> {{metrics[card.cardId].utilizationRate | number:1}}%</p></div></div></div></div>',
      link: function(scope) {
        scope.selectCard = function(card) {
          scope.onSelect({card: card});
        };
      }
    };
  }]);
})();