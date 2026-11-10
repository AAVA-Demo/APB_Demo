(function() {
  'use strict';
  angular.module('dashboardModule').directive('cardSummary', [function() {
    return {
      restrict: 'E',
      scope: { card: '=' },
      template: '<div class="card-summary"><h4>{{card.cardType}}</h4><div class="card-number">{{card.cardNumber}}</div><div class="card-metrics"><span><strong>Limit:</strong> {{card.creditLimit | currency}}</span><span><strong>Outstanding:</strong> {{card.outstandingAmount | currency}}</span><span><strong>Available:</strong> {{(card.creditLimit - card.outstandingAmount) | currency}}</span></div></div>'
    };
  }]);
})();