(function() {
  'use strict';
  angular.module('dashboardModule').directive('creditCardList', [creditCardList]);
  function creditCardList() {
    return {
      restrict: 'E',
      scope: { cards: '=' },
      template: '<div class="credit-card" ng-repeat="card in cards track by card.cardId"><h4>{{card.issuer}}</h4><div class="card-number">{{card.cardNumber}}</div><div class="card-details"><div><small>Credit Limit</small><br><strong>${{card.creditLimit | number:2}}</strong></div><div><small>Available</small><br><strong>${{card.availableCredit | number:2}}</strong></div><div><small>Outstanding</small><br><strong>${{card.outstandingBalance | number:2}}</strong></div></div></div>'
    };
  }
})();