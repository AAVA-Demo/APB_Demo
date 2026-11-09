(function() {
  'use strict';
  angular.module('creditCard.dashboard').directive('ccCardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div class="card-list"><div class="card-item" ng-repeat="card in cards track by card.id"><div class="card-header"><h4>{{card.issuer}} {{card.cardType}}</h4><p class="card-number">{{card.cardNumber}}</p></div><div class="card-body"><div class="row"><div class="col-xs-6"><strong>Credit Limit:</strong><br>${{card.creditLimit | number:2}}</div><div class="col-xs-6"><strong>Current Balance:</strong><br>${{card.currentBalance | number:2}}</div></div><div class="row"><div class="col-xs-6"><strong>Available Credit:</strong><br>${{card.availableCredit | number:2}}</div><div class="col-xs-6"><strong>Outstanding:</strong><br>${{card.outstandingAmount | number:2}}</div></div><div class="row"><div class="col-xs-12"><strong>Monthly Spend:</strong> ${{card.monthlySpend | number:2}}</div></div></div></div></div>'
    };
  }]);
})();