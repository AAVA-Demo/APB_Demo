(function() {
  'use strict';
  angular.module('ccDashboardModule').directive('creditCardSummary', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div class="card-summary"><h4>Your Credit Cards</h4><div class="card-item" ng-repeat="card in cards"><div><span class="card-name">{{card.cardName}}</span><span class="card-balance">${{card.availableCredit | number:2}}</span></div><div class="card-number">{{card.cardNumber}}</div><div style="margin-top:5px;"><small>Limit: ${{card.creditLimit | number:2}} | Outstanding: ${{card.outstandingAmount | number:2}}</small></div></div></div>'
    };
  }]);
})();